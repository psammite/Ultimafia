const Card = require("../../Card");
const Action = require("../../Action");
const Random = require("../../../../../lib/Random");

module.exports = class DefendAndSnatchGun extends Card {
  constructor(role) {
    super(role);

    this.immunity["gun"] = "Infinity";
    this.listeners = {
      immune: function (action) {
        if (action.target !== this.player) {
          return;
        }

        if (!action.hasLabel("gun")) {
          return;
        }

        let toSnatch =
          Random.randFloatRange(0, 100) <= 80 && action.actor != this.player;
        if (toSnatch) {
          action.item.hold(this.player);
          this.player.queueAlert("You dodge and adeptly snatch the gun...");
          action.item.incrementMeetingName();
          this.game.instantMeeting(action.item.meetings, [this.player]);
          return;
        }

        let killAction = new Action({
          // do not add gun label
          labels: ["kill"],
          actor: action.actor,
          target: this.player,
          game: this.player.game,
          run: function () {
            if (this.dominates()) {
              this.target.kill("gun", this.actor, true);
            }
          },
        });
        this.game.instantAction(killAction);
      },
    };
  }
};
