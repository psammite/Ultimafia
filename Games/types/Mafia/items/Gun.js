const Item = require("../Item");
const Action = require("../Action");
const Random = require("../../../../lib/Random");

module.exports = class Gun extends Item {
  constructor(options) {
    super("Gun");

    this.reveal = options?.reveal;
    this.mafiaImmune = options?.mafiaImmune;
    this.magicBullet = options?.magicBullet;
    this.cursed = options?.cursed;

    this.baseMeetingName = "Shoot Gun";
    this.currentMeetingIndex = 0;

    this.meetings = {
      [this.baseMeetingName]: {
        actionName: "Shoot",
        states: ["Day"],
        flags: ["voting", "instant", "noVeg"],
        action: {
          labels: ["kill", "gun"],
          item: this,
          run: function () {
            this.item.drop();
            this.game.broadcast("gunshot");

            var shooterMask = this.actor.role.data.shooterMask;
            var reveal = shooterMask ? true : this.item.reveal;
            if (reveal == null) {
              reveal = Random.randArrayVal([true, false]);
            }
            if (shooterMask == null) {
              shooterMask = this.actor.name;
            }

            var mafiaImmune = this.item.mafiaImmune;
            var magicBullet = this.item.magicBullet;
            var cursed = this.item.cursed;

            if (cursed) {
              this.target = this.actor;
            }

            if (reveal && cursed)
              this.game.queueAlert(
                `:gunfab: ${shooterMask} pulls a gun, it backfires!`
              );
            else if (reveal && !cursed)
              this.game.queueAlert(
                `:gun: ${shooterMask} pulls a gun and shoots at ${this.target.name}!`
              );
            else
              this.game.queueAlert(
                `:gun: Someone fires a gun at ${this.target.name}!`
              );

            // convert or kill
            if (magicBullet && this.target.role.alignment !== "Cult") {
              let action = new Action({
                actor: this.actor,
                target: this.target,
                game: this.game,
                labels: ["convert", "hidden"],
                run: function () {
                  if (this.dominates()) this.target.setRole("Cultist");
                },
              });
              action.do();
              return;
            }

            // kill
            if (mafiaImmune && this.target.role.alignment == "Mafia") return;

            if (this.dominates()) {
              this.target.kill("gun", this.actor, true);
            }
          },
        },
      },
    };
  }

  get snoopName() {
    if (this.mafiaImmune) {
      return "Gun (Gunrunner)";
    } else if (this.magicBullet) {
      return "Gun (Dwarf)";
    } else if (this.cursed) {
      return "Gun (Cursed)";
    }

    return this.name;
  }

  getMeetingName(idx) {
    return `${this.id} ${idx}`;
  }

  getCurrentMeetingName() {
    if (this.currentMeetingIndex === 0) {
      return this.baseMeetingName;
    }

    return this.getMeetingName(this.currentMeetingIndex);
  }

  // increase meeting name index to ensure each meeting name is unique
  incrementMeetingName() {
    let mtg = this.meetings[this.getCurrentMeetingName()];
    delete this.meetings[this.getCurrentMeetingName()];
    this.currentMeetingIndex += 1;
    this.meetings[this.getCurrentMeetingName()] = mtg;
  }
};
