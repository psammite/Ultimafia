import express = require("express");
import type { Model } from "mongoose";
import routeUtils = require("./utils");
import redis = require("../modules/redis");
import constants = require("../data/constants");
import shortid = require("shortid");
import createLogger = require("../modules/logging");
import errors = require("../lib/errors");

// The legacy model registry is populated dynamically. Describe only the models
// used by this pilot; keep these fields aligned with db/schemas.js.
interface ChatChannel {
  id: string;
  name: string;
  position: number;
  rank: number;
  public: boolean;
  lastMessageDate: number;
}

const models: {
  ChatChannel: Model<ChatChannel>;
  ChatMessage: Model<{ channel: string }>;
} = require("../db/models");

// Bodies are untrusted; existing parsing below preserves the endpoint behavior.
interface RoomBody {
  name?: unknown;
  position?: unknown;
  rank?: unknown;
}

const logger = createLogger(".");
const router = express.Router();

router.get<{}, string>("/connect", async function (req, res) {
  try {
    var userId = await routeUtils.verifyLoggedIn(req, true);

    if (!userId) {
      res.send("");
      return;
    }

    var token = await redis.createAuthToken(userId);
    res.send(token);
  } catch (e) {
    logger.error(e);
    errors.serverError(res, "Failed to load chat. Please refresh and try again.");
  }
});

router.post<{}, string, RoomBody>("/room", async function (req, res) {
  try {
    var userId = await routeUtils.verifyLoggedIn(req, false);
    var perm = "createRoom";

    if (!(await routeUtils.verifyPermission(res, userId, perm))) return;

    var name = routeUtils
      .strParseAlphaNum(req.body.name)
      .slice(0, constants.maxChannelNameLength);
    var position = Number(req.body.position) || 0;
    var rank = Number(req.body.rank) || 0;

    var existingChannel = await models.ChatChannel.findOne({
      name: new RegExp(`^${name}$`, "i"),
      public: true,
    }).select("_id");

    if (existingChannel) {
      errors.conflict(res, "A room with this name already exists.");
      return;
    }

    var room = new models.ChatChannel({
      id: shortid.generate(),
      name,
      position,
      rank,
      public: true,
      lastMessageDate: Date.now(),
    });
    room.save();

    res.sendStatus(200);
  } catch (e) {
    logger.error(e);
    errors.serverError(res, "Error creating room. Please try again.");
  }
});

router.post<{}, string, Pick<RoomBody, "name">>("/room/delete", async function (req, res) {
  try {
    var userId = await routeUtils.verifyLoggedIn(req, false);
    var name = routeUtils.strParseAlphaNum(req.body.name);
    var perm = "deleteRoom";

    var channel = await models.ChatChannel.findOne({
      name: new RegExp(`^${name}$`, "i"),
      public: true,
    }).select("id rank");

    if (!channel) {
      errors.notFound(res, "Room not found.");
      return;
    }

    if (!(await routeUtils.verifyPermission(res, userId, perm, channel.rank)))
      return;

    await models.ChatChannel.deleteOne({ id: channel.id }).exec();
    await models.ChatMessage.deleteMany({ channel: channel.id }).exec();

    res.sendStatus(200);
  } catch (e) {
    logger.error(e);
    errors.serverError(res, "Error deleting room. Please try again.");
  }
});

export = router;
