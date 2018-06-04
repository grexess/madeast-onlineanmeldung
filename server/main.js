import {
  Meteor
} from 'meteor/meteor';
import {
  Email
} from 'meteor/email';
import '../imports/api/runners.js';
import '../imports/api/team.js';

import {
  Runners
} from '../imports/api/runners.js';

import {
  Team
} from '../imports/api/team.js';

Meteor.startup(() => {
  // code to run on server at startup
});

Runners.allow({
  'insert': function (userId, doc) {
    /* user and doc checks ,
    return true to allow insert */
    return true;
  },
  'remove': function (userId, doc) {
    /* user and doc checks ,
    return true to allow insert */
    return true;
  },
  'update': function (userId, doc) {
    /* user and doc checks ,
    return true to allow insert */
    return true;
  }
});


Team.allow({
  'insert': function (userId, doc) {
    /* user and doc checks ,
    return true to allow insert */
    return true;
  },
  'remove': function (userId, doc) {
    /* user and doc checks ,
    return true to allow insert */
    return true;
  },
  'update': function (userId, doc) {
    /* user and doc checks ,
    return true to allow insert */
    return true;
  }
});

Meteor.methods({
  sendEmail: function (type, to, from, subject, oRunner) {

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: buildEmailText(type, oRunner)
    });

    Email.send({
      to: "administrator@madcross.de",
      from: from,
      subject: "[INFO] Neue MadEast-Anmeldung",
      text: buildEmailText(type, oRunner)
    });
  },

  getTeams: function () {

    var teamlist = [
      {
        event: 'MAD 4er Team',
        registr: Team.find().count(),
        payed: Team.find({ payed: true }).count(),
        teams: Team.find({ payed: true }).fetch(),
      }
    ];
    return teamlist;
  },

  getResults: function () {

    var results = [
      {
        event: 'MAD 4er Team',
        registr: Team.find().count(),
        payed: Team.find({ payed: true }).count(),
        teams: Team.find({ payed: true }).fetch(),
      }
    ];
    return Runners.find({},{sort:{ time: 1}}).fetch();
  },

  getRunners: function () {

    var eventlist = [
      {
        event: 'MAD Enduro',
        registr: Runners.find({ event: 1 }).count(),
        payed: Runners.find({ event: 1, payed: true }).count(),
        runners: Runners.find({ event: 1, payed: true }).fetch(),
      },
      {
        event: 'MAD HALL4X',
        registr: Runners.find({ event: 5 }).count(),
        payed: Runners.find({ event: 5, payed: true }).count(),
        runners: Runners.find({ event: 5, payed: true }).fetch(),
      },
      {
        event: 'MAD Nachwuchs',
        registr: Runners.find({ event: 3 }).count(),
        payed: Runners.find({ event: 3, payed: true }).count(),
        runners: Runners.find({ event: 3, payed: true }).fetch(),
      },
      {
        event: 'MAD Crosscountry',
        registr: Runners.find({ event: 4 }).count(),
        payed: Runners.find({ event: 4, payed: true }).count(),
        runners: Runners.find({ event: 4, payed: true }).fetch(),
      }
    ];
    return eventlist;
  },

  getEventCounts: function (eventID) {

    var obj = {}, cnt;

    switch (eventID) {
      case 1:
        cnt = Runners.find({ event: eventID }).count();
        var cntadd = Runners.find({ event: 5 }).count();

        var all = cnt + cntadd;

        obj.msg = "Noch " + (100 - all) + " von 100 Plätzen verfügbar";
        obj.wid = Math.round(((100 - all) * 100) / 100) + "%";
        break;
      case 5:
        cnt = Runners.find({ event: eventID }).count();
        obj.msg = "Noch " + (32 - cnt) + " von 32 Plätzen verfügbar";
        obj.wid = Math.round(((32 - cnt) * 100) / 32) + "%";
        break;
    }
    return obj;
  },

  getEventStatus: function () {

    var obj = []
    var subObj;

    obj.push([Runners.find({ event: 1 }).count(), Runners.find({ event: 1, payed: true }).count()]);
    obj.push([Runners.find({ event: 5 }).count(), Runners.find({ event: 5, payed: true }).count()]);
    obj.push([Runners.find({ event: 3 }).count(), Runners.find({ event: 3, payed: true }).count()]);
    obj.push([Runners.find({ event: 4 }).count(), Runners.find({ event: 4, payed: true }).count()]);

    return obj;
  },

  checkToken: function (email, token) {

    var x = Runners.find({
      email: email
    }).fetch();

    if (x.length === 1) {
      if (x[0].token === token) {
        if (x[0].verified) {
          //already verified
          return 1;
        } else {
          //okay
          //update registration status
          Runners.update({
            _id: x[0]._id
          }, {
              $set: {
                verified: true
              }
            })
          return 0;
        }
      } else {
        //wrong token
        return 2;
      }
    } else {
      //mail not unique or not existing
      return 3;
    }
  },
});

function buildEmailText(type, obj) {

  var text;

  var cost = "", event = "";
  switch (obj.event) {
    case 1:
      event = "MAD Enduro"
      cost = "25€";
      break;
    case 2:
      event = "MAD Laufradrennen"
      cost = "0€";
      break;
    case 3:
      event = "MAD Nachwuchs"
      cost = "5€";
      break;
    case 4:
      event = "MAD Crosscountry"
      cost = "10€";
      break;
    case 5:
      event = "MAD Enduro + MAD HALL4X"
      cost = "25€";
      break;
    case 6:
      event = "MAD 4er Team"
      cost = "25€";
      break;
  }

  var gender = "";
  obj.gender == "male" ? gender = "männlich" : gender = "weiblich";

  switch (type) {
    case 1:
      text = "________________________________________________________________________\n \n MAD EAST ONLINEANMELDUNG\n________________________________________________________________________\n\nServus Team  " + obj.teamname + ", vielen Dank f\u00FCr Eure Anmeldung am 4er Teamrennen.\n\nStartgeld:\u0009" + "Knobeln wir noch aus und informieren Euch." + "\n\nStarter 1:\u0009" + obj.starter1 + "\nStarter 1:\u0009" + obj.starter2 + "\nStarter 3:\u0009" + obj.starter3 + "\nStarter 4:\u0009" + obj.starter4 + "\n\n\nEmail: \u0009\u0009" + obj.teamemail + "\n\n\n##### Pfandgeld #####\nBitte denke daran w\u00E4hrend der Veranstaltung Bargeld einzustecken, da wir bei der Essen- und Getr\u00E4nkeausgabe auf M\u00FCll verzichten wollen und Mehrweggeschirr nur gegen Pfand ausgeben!\n\nViele Gr\u00FC\u00DFe\nMad East Crew";
      break;

    default:
      text = "________________________________________________________________________\n \n MAD EAST ONLINEANMELDUNG\n________________________________________________________________________\n\nServus " + obj.firstname + ", vielen Dank f\u00FCr deine Anmeldung.\n\nStrecke: \u0009" + event + "\nStartgeld:\u0009" + cost + "\n\nVorname:\u0009" + obj.firstname + "\nName:\u0009\u0009" + obj.lastname + "\n\n\nEmail: \u0009\u0009" + obj.email + "\nGeschlecht:\u0009" + gender + "\n\nGeburtsdatum: \u0009" + obj.birthday + "\nTeam/Verein: \u0009" + obj.team + "\n\nBitte \u00FCberweise das Startgeld auf unser Bankkonto.\n\n\u00BB Mad East Challenge e.V.\n\u00BB Osts\u00E4chsische Sparkasse Dresden\n\u00BB IBAN: DE56 8505 0300 1225 2129 83\n\u00BB BIC: OSDDDE81XXX\n\u00BB Verwendungszweck: Startgeld, \"Gew\u00E4hlte Strecke\", Name, Vorname\n\n\n##### Pfandgeld #####\nBitte denke daran w\u00E4hrend der Veranstaltung Bargeld einzustecken, da wir bei der Essen- und Getr\u00E4nkeausgabe auf M\u00FCll verzichten wollen und Mehrweggeschirr nur gegen Pfand ausgeben!\n\nViele Gr\u00FC\u00DFe\nMad East Crew";
      break;
  }


  return text;
}