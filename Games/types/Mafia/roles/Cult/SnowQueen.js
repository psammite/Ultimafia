const Role = require("../../Role");

module.exports = class SnowQueen extends Role {
  constructor(player, data) {
    super("Snow Queen", player, data);
    this.alignment = "Cult";
    this.cards = [
      "VillageCore",
      "WinWithCult",
      "MeetingCult",
      "CauseSnowstorm",
    ];
  }
};
