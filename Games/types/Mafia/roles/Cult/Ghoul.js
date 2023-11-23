const Role = require("../../Role");

module.exports = class Ghoul extends Role {
  constructor(player, data) {
    super("Ghoul", player, data);
    this.alignment = "Cult";
    this.cards = ["VillageCore", "WinWithCult", "MeetingCult", "CopyActions"];
  }
};
