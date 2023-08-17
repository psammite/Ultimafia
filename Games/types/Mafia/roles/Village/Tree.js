const Role = require("../../Role");

module.exports = class Tree extends Role {
  constructor(player, data) {
    super("Tree", player, data);
    this.alignment = "Village";
    this.cards = [
      "VillageCore",
      "WinWithVillage",
      "ConvertImmune",
      "CondemnImmune",
    ];
    this.immunity["kill"] = 5;
    this.cancelImmunity["ignite"] = Infinity;
    this.cancelImmunity["bomb"] = Infinity;
    this.meetingMods = {
      Village: {
        canVote: false,
      },
    };
  }
};
