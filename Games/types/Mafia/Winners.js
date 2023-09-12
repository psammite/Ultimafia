const Winners = require("../../core/Winners");

module.exports = class MafiaWinners extends Winners {
  constructor(name, player, data) {
    super(name, player, data);
  }

  getGroupWinMessage(group, plural) {
    switch (group) {
      case "Village":
        return ":flagblue: The Village has successfully driven out the scum and villainy from their home!";
      case "Mafia":
        return ":flagblack: The Mafia has deceived its way into victory. Make sure you've paid your protection money.";
      case "Cult":
        return ":flagyellow: The dark gods of the Cult have been unleashed. The town has been reduced to a blasted heath.";
      case "Admirer":
        return "Without anyone noticing, the Admirer sabotages the efforts of the town against their idol.";
      case "Alien":
        return "An Alien mothership arrived overhead, abducting all of the probed victims from the town.";
      case "Anarchist":
        return "Once the dust had settled, it was obvious that nobody in town was safe from the Anarchist.";
      case "Angel":
        return "The Angel made the ultimate sacrifice for their beloved and has given them favor in the Heavens.";
      case "Autocrat":
        return "The Village thought that they had saved the day, but the Autocrat's oppressive rule smothered any remaining hope.";
      case "Clockmaker":
        return "When the bell tower rang out at 12, everyone knew that the Clockmaker's hour had come.";
      case "Creepy Girl":
        return "After burying the last body, the haunted doll was put to rest. The Creepy Girl was free to lead her own life.";
      case "Cupid":
        return "Ordained by Mount Olympus, Cupid ensured that the star-crossed lovers survived the chaos.";
      case "Dodo":
        return "If this were target practice then that would have been a crack shot! Unfortunately, someone killed the last living Dodo.";
      case "Executioner":
        return "The Executioner finally got to pull the lever on their begrudged victim.";
      case "Fool":
        return "Who is more foolish: the Fool, or the fools who condemned him?";
      case "Gambler":
        return "The town bet against the Gambler, but the Gambler won.";
      case "Gingerbread Man":
        return "Nobody could catch up to the Gingerbread Man.";
      case "Grouch":
        return "Although the Village had lost, the Grouch rejoiced at their misery.";
      case "Hellhound":
        return "The town was ravaged by a demon in the shape of a beast. Under the Blood Moon, one can still hear the baying of the Hellhound.";
      case "Joker":
        return "Who's having the last laugh, now? The Joker or those who fell for the trap?";
      case "Leprechaun":
        return "The Leprechaun retrieved all of their four-leaf clovers and got out of town at the next opportunity!";
      case "Lover":
        return "Through it all, the Lover made it out alive with her beloved.";
      case "Mastermind":
        return "The Mafia thought that their day had come, but they soon found themselves under the thumb of the Mastermind.";
      case "Matchmaker":
        return ":mistletoe: The Matchmaker proved that love conquers all, claiming the town for themselves.";
      case "Monk":
        return "By eschewing violence, the Monk enlightened the town and converted them to his ways.";
      case "Mutineer":
        return "The Mafia thought they had won, but were soon picked off by a Mutineer within their ranks.";
      case "Nomad":
        return "The Nomad settled down among the townsfolk and made their allegiance known.";
      case "Palladist":
        return "Although the Village had driven out their foes, their Masonic Lodge had been beset by an evil from within. The eerie cult of the Palladist and their unwitting minions have started to take root in nearby towns and across the countryside..";
      case "Nyarlathotep":
        return "Although the Cult thought that they had won, their dark gods never came. Out of the blackness crawled the pharaoh Nyarlathotep, whose dark sciences would enthrall Man for another twenty-seven centuries.";
      case "Polar Bear":
        return "Blessed by the Aurora Borealis, the Polar Bear fought its way to freedom and fled for true north. The town was left ravaged by its magnetic powers.";
      case "Politician":
        return "To nobody's surprise, the Politician saw the writing on the wall and made their play.";
      case "Prophet":
        return "Nobody believed in the words of the Prophet to come to pass until the day finally came.";
      case "Ripper":
        return "The streets used to be riddled with evildoers, but now people only remember the name of the Ripper.";
      case "Rival":
        return "The Rivals wiped themselves out until there was only one left standing!";
      case "Serial Killer":
        return "The town was powerless against the Serial Killer and the terror they brought in the night. It has been abandoned.";
      case "Sidekick":
        return "The Sidekick cleared the way for their partner's victory.";
      case "Siren":
        return "Nobody goes down by the lake anymore. It is said that at night you can still hear the Siren's song.";
      case "Supervillain":
        return "Here's a little lesson in trickery, this is going down in history. If you wanna be a villain number one, then look no further than the Supervillain.";
      case "Survivor":
        return "Through the carnage, the Survivor drifted on.";
      case "Turkey":
        return "The grain shipments arrived in town a day too late and found bodies being pecked at by Turkeys...";
      case "Usurper":
        return "The Mafia thought that they had claimed the town, but they were stripped of their power by the Usurper.";
      case "Vengeful Spirit":
        return "After dragging their enemies down with them, the Vengeful Spirit could finally pass on to the next life.";
      case "Warlock":
        return "The town proved themselves to be predictable as ever in the eyes of the learned Warlock.";
      case "Yandere":
        return "Beyond lovesick, the Yandere cut down all that stood between them and their beloved.";
      default:
        return super.getGroupWinMessage(group, plural);
    }
  }
};
