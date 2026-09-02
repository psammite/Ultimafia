const assert = require("node:assert/strict");
const express = require("express");

describe("TypeScript route pilot", function () {
  let server;
  let baseUrl;
  let existingChannel;
  let permission;
  let redisFailure;
  let savedRooms;
  let deletions;
  let permissionChecks;
  const originalModules = new Map();

  function mockModule(path, exports) {
    const id = require.resolve(path);
    originalModules.set(id, require.cache[id]);
    require.cache[id] = { id, filename: id, loaded: true, exports };
  }

  before(function (done) {
    class ChatChannel {
      constructor(fields) { Object.assign(this, fields); }
      save() { savedRooms.push(this); return Promise.resolve(this); }
      static findOne() { return { select: async () => existingChannel }; }
      static deleteOne(filter) {
        return { exec: async () => deletions.push(["channel", filter]) };
      }
    }

    mockModule("../db/models", {
      ChatChannel,
      ChatMessage: {
        deleteMany: (filter) => ({
          exec: async () => deletions.push(["messages", filter]),
        }),
      },
    });
    mockModule("../modules/redis", {
      createAuthToken: async (userId) => {
        if (redisFailure) throw new Error("Redis unavailable");
        return `token-${userId}`;
      },
      hasPermission: async (...args) => {
        permissionChecks.push(args);
        return permission;
      },
    });
    mockModule("../modules/logging", () => ({ error() {} }));

    // Reload the real auth/parsing helpers against isolated persistence mocks.
    for (const path of ["../routes/utils", "../routes/chat", "../routes/achievements"]) {
      const id = require.resolve(path);
      originalModules.set(id, require.cache[id]);
      delete require.cache[id];
    }

    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.session = req.headers["x-test-user"]
        ? { user: { id: req.headers["x-test-user"] } }
        : {};
      next();
    });
    app.use("/achievements", require("../routes/achievements"));
    app.use("/chat", require("../routes/chat"));
    server = app.listen(0, "127.0.0.1", () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      done();
    });
  });

  beforeEach(function () {
    existingChannel = null;
    permission = true;
    redisFailure = false;
    savedRooms = [];
    deletions = [];
    permissionChecks = [];
  });

  after(function (done) {
    for (const [id, previous] of originalModules) {
      if (previous) require.cache[id] = previous;
      else delete require.cache[id];
    }
    if (server) server.close(done);
    else done();
  });

  function post(path, body, loggedIn = true) {
    return fetch(`${baseUrl}/chat${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(loggedIn ? { "x-test-user": "user-1" } : {}),
      },
      body: JSON.stringify(body),
    });
  }

  it("serves the existing achievement data as JSON", async function () {
    const response = await fetch(`${baseUrl}/achievements`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /application\/json/);
    assert.deepEqual(await response.json(), require("../data/Achievements"));
  });

  it("returns an empty token for an anonymous connection", async function () {
    const response = await fetch(`${baseUrl}/chat/connect`);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), "");
  });

  it("creates a token for the session user", async function () {
    const response = await fetch(`${baseUrl}/chat/connect`, {
      headers: { "x-test-user": "user-1" },
    });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), "token-user-1");
  });

  it("preserves connection error responses", async function () {
    redisFailure = true;
    const response = await fetch(`${baseUrl}/chat/connect`, {
      headers: { "x-test-user": "user-1" },
    });
    assert.equal(response.status, 500);
    assert.equal(await response.text(), "Failed to load chat. Please refresh and try again.");
  });

  it("preserves the existing unauthenticated room error", async function () {
    const response = await post("/room", { name: "room" }, false);
    assert.equal(response.status, 500);
    assert.equal(await response.text(), "Error creating room. Please try again.");
    assert.equal(savedRooms.length, 0);
  });

  it("prevents room creation without permission", async function () {
    permission = false;
    const response = await post("/room", { name: "room" });
    assert.equal(response.status, 403);
    assert.equal(savedRooms.length, 0);
  });

  it("preserves room name sanitization and numeric defaults", async function () {
    const response = await post("/room", { name: "Room<>!", position: "2", rank: "invalid" });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), "OK");
    assert.equal(savedRooms.length, 1);
    assert.equal(savedRooms[0].name, "Room");
    assert.equal(savedRooms[0].position, 2);
    assert.equal(savedRooms[0].rank, 0);
    assert.equal(savedRooms[0].public, true);
  });

  it("rejects duplicate rooms", async function () {
    existingChannel = { id: "room-1", rank: 3 };
    const response = await post("/room", { name: "room" });
    assert.equal(response.status, 409);
    assert.equal(savedRooms.length, 0);
  });

  it("returns 404 when deleting a missing room", async function () {
    const response = await post("/room/delete", { name: "missing" });
    assert.equal(response.status, 404);
    assert.deepEqual(deletions, []);
  });

  it("checks the channel rank before deleting", async function () {
    existingChannel = { id: "room-1", rank: 3 };
    permission = false;
    const response = await post("/room/delete", { name: "room" });
    assert.equal(response.status, 403);
    assert.deepEqual(permissionChecks, [["user-1", "deleteRoom", 3]]);
    assert.deepEqual(deletions, []);
  });

  it("deletes the authorized room and its messages", async function () {
    existingChannel = { id: "room-1", rank: 3 };
    const response = await post("/room/delete", { name: "room" });
    assert.equal(response.status, 200);
    assert.deepEqual(deletions, [
      ["channel", { id: "room-1" }],
      ["messages", { channel: "room-1" }],
    ]);
  });
});
