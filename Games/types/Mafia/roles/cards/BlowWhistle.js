const Card = require("../../Card");
const { PRIORITY_EFFECT_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class BlowWhistle extends Card {
  constructor(role) {
    super(role);

    this.meetings = {
      "Blow Whistle on": {
        states: ["Night"],
        flags: ["voting"],
        targets: { include: ["alive"], exclude: ["self", isPrevTarget] },
        action: {
          labels: ["effect", "whistleblown"],
          priority: PRIORITY_EFFECT_GIVER_DEFAULT,
          run: function () {
            this.actor.role.prevTarget = this.target;
            this.target.giveEffect("Whistleblown", 1);
          },
        },
      },
    };
  }
};

function isPrevTarget(player) {
  return this.role && player == this.role.prevTarget;
}
