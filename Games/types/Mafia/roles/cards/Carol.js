const Card = require("../../Card");
const Random = require("../../../../../lib/Random");
const {
  PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT,
} = require("../../const/Priority");

module.exports = class Carol extends Card {
  constructor(role) {
    super(role);

    this.meetings = {
      "Sing Carol": {
        states: ["Night"],
        flags: ["voting"],
        targets: { include: ["alive"], exclude: ["self", isPrevTarget] },
        action: {
          labels: ["carol"],
          priority: PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT,
          run: function () {
            this.actor.role.data.prevTarget = this.target;

            var alive = this.game.players.filter((p) => p.alive);
            if (alive.length < 3) return;

            const visitors = this.getVisitors(this.target).filter(
              (p) => p != this.actor
            );
            if (visitors.length > 0) return;

            var carol;
            var evilPlayers = alive.filter(
              (p) =>
                p.role.alignment == "Mafia" ||
                p.role.alignment == "Cult" ||
                p.role.alignment == "Hostile"
            );
            var chosenThree = [
              Random.randArrayVal(alive, true),
              Random.randArrayVal(alive, true),
              Random.randArrayVal(alive, true),
            ];

            if (evilPlayers.length == 0) {
              carol = `:sy3c: You see a merry Caroler outside your house! They sing you a happy song about all of the evil players being dead!`;
            } else {
              chosenThree[0] = Random.randArrayVal(evilPlayers);
              chosenThree = Random.randomizeArray(chosenThree);
              carol = `:sy3c: You see a merry Caroler outside your house! They sing you a Carol about ${chosenThree[0].name}, ${chosenThree[1].name}, ${chosenThree[2].name}, at least one of whom is evil!`;
            }

            this.target.queueAlert(carol);
          },
        },
      },
    };
  }
};

function isPrevTarget(player) {
  return this.role && player == this.role.data.prevTarget;
}
