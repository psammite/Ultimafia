import express = require("express");
import AchievementData = require("../data/Achievements");
import createLogger = require("../modules/logging");
const logger = createLogger(".");
const router = express.Router();

router.get<{}, typeof AchievementData | Record<string, never>>(
  "/",
  async function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    try {
      res.send(AchievementData);
    } catch (e) {
      logger.error(e);
      res.send({});
    }
  }
);

export = router;
