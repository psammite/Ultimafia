const Card = require("../../Card");
const {
  PRIORITY_NIGHT_SAVER,
  PRIORITY_KILL_DEFAULT,
} = require("../../const/Priority");

module.exports = class HideBehindPlayer extends Card {
  constructor(role) {
    super(role);

    this.meetings = {
      "Hide Behind": {
        states: ["Night"],
        flags: ["voting"],
        action: {
          labels: ["save"],
          priority: PRIORITY_NIGHT_SAVER,
          run: function () {
            this.actor.role.hideBehind = this.target;
            this.actor.tempImmunity["kill"] = Infinity;
          },
        },
      },
    };

    this.listeners = {
      state: function (stateInfo) {
        if (!this.player.alive) {
          return;
        }

        if (!stateInfo.name.match(/Day/)) {
          return;
        }

        delete this.hideBehind;
      },
    };

    this.actions = [
      {
        priority: PRIORITY_KILL_DEFAULT,
        labels: ["kill", "hidden", "absolute"],
        run: function () {
          if (this.game.getStateName() != "Night") return;

          if (!this.actor.alive) return;

          let visitors = this.getVisitors();
          for (let v of visitors) {
            if (v == this.actor.role.hideBehind) {
              // skip the dominates check, this kill is absolute
              this.actor.kill("eaten", v);
              this.actor.giveEffect("ExtraLife", this.actor);
              this.actor.queueAlert(
                "You gained an extra life from hiding correctly."
              );
            }
          }
        },
      },
    ];
  }
};
