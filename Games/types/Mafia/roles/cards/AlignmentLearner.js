const Card = require("../../Card");
const { PRIORITY_INVESTIGATIVE_DEFAULT } = require("../../const/Priority");

module.exports = class AlignmentLearner extends Card {
  constructor(role) {
    super(role);

    this.meetings = {
      "Learn Alignment": {
        states: ["Night"],
        flags: ["voting"],
        action: {
          labels: ["investigate", "alignment"],
          priority: PRIORITY_INVESTIGATIVE_DEFAULT,
          run: function () {
            var role = this.target.getAppearance("investigate", true);
            var alignment = this.game.getRoleAlignment(role);

            if (alignment == "Village") alignment = "innocent";
            else alignment = `guilty`;

            var alert = `:invest: You learn that ${this.target.name} is ${alignment}.`;
            this.game.queueAlert(alert, 0, this.meeting.getPlayers());
          },
        },
      },
    };
  }
};
