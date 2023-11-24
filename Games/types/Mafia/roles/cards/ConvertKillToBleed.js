const Card = require("../../Card");

module.exports = class ConvertKillToBleed extends Card {
  constructor(role) {
    super(role);

    this.immunity.kill = 1;
    this.cancelImmunity.bleed = Infinity;

    this.listeners = {
      immune: function (action) {
        if (
          action.target === this.player &&
          action.hasLabel("kill") &&
          !this.player.tempImmunity["kill"]
        ) {
          // check for effect immunity
          for (let effect of this.player.effects)
            if (effect.immunity["kill"]) return;

          // check for cleanse
          for (let action of this.game.actions[0]) {
            if (action.target === this.player && action.hasLabel("cleanse")) {
              return;
            }
          }

          this.player.giveEffect("Bleeding", action.actor);
        }
      },
    };
  }
};
