//import { Template } from 'meteor/templating';
//import { ReactiveVar } from 'meteor/reactive-var';

/*  GLOBAL VARIABLES */
maxMadENDURO = 100;
maxMadENDUROHALL4X = 32;

import {
  Runners
} from '../imports/api/runners.js';

import {
  Team
} from '../imports/api/team.js';

//import './main.html';

import '../imports/ui/templates/header.html';
import '../imports/ui/templates/footer.html';

import '../imports/ui/templates/verify.html';
import '../imports/ui/templates/birthday.html';
import '../imports/ui/templates/register.html';
import '../imports/ui/templates/registerlist.html';

import '../imports/ui/templates/private/runnersList.html';
import '../imports/ui/templates/private/login.html';
import '../imports/ui/templates/private/runnersList.js';
import '../imports/ui/templates/private/teamList.js';
import '../imports/ui/templates/registerlist.js';
import '../imports/ui/templates/register.js';
import '../imports/ui/templates/results.js';

import '../imports/ui/templates/statistics.js';
import '../imports/ui/templates/statistics.html';

import '../imports/ui/times/times.js';
import '../imports/ui/times/results.js';

import '../imports/startup/accounts-config.js';

Template.registerform.onCreated(function helloOnCreated() {
  console.log("Form created");
  Meteor.subscribe('runners');
  Meteor.subscribe('team');
  // counter starts at 0
  //this.counter = new ReactiveVar(0);
});

Template.registerform.onRendered(function () {
  /* Check if maximum of registrations are exceeded */
  Meteor.call('getEventStatus', function (error, result) {
    if ((result[0][0] + result[1][0]) >= maxMadENDURO) {
      $('#event option[value=1]').attr('disabled', 'disabled');
      $('#max1Cnt').text(maxMadENDURO);
      $('#max1').show();
    }
    if (result[1][0] >= maxMadENDUROHALL4X) {
      $('#event option[value=5]').attr('disabled', 'disabled');
      $('#max5Cnt').text(maxMadENDUROHALL4X);
      $('#max5').show();
    }
  });
});

Template.emailVerification.onCreated(function () {
  console.log("Verify Page created");
  Meteor.subscribe('runners');
});

Template.runnersListTemplate.onCreated(function () {
  console.log("List Page created");
  Meteor.subscribe('runners');
});

Template.teamListTemplate.onCreated(function () {
  console.log("Team List Page created");
  Meteor.subscribe('team');
});

Template.registerform.events({

  'focusout #eMail'() {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String($('#eMail').val()).toLowerCase())) {
      //alert(true);
    } else {
      $('#errorMsg').text("eMail-Adresse hat kein gültiges Format");
      $('#id02').show();
    }
  },

  'focusout #teamEmail'() {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String($('#teamEmail').val()).toLowerCase())) {
      //alert(true);
    } else {
      $('#errorMsg').text("eMail-Adresse hat kein gültiges Format");
      $('#id02').show();
    }
  },

  'click .navElem': function (event, instance) {
    event.preventDefault();
    instance.$('.prvCntDiv').hide();
    instance.$('.navElem').removeClass("w3-green");
    instance.$(event.currentTarget).addClass("w3-green");
    instance.$('#' + event.currentTarget.dataset.target).show();

    if (event.currentTarget.dataset.target == "lists") {
      $("#registerUL").trigger("click");
    }

  },

  'change #event'(event) {
    event.preventDefault();
    var selId = parseInt($("#event option:selected").val());
    var wid, msg;

    $("#formdata").show();
    $("#availCount").hide();
    $("#teamdata").hide();

    switch (selId) {
      case 1:
        Meteor.call('getEventCounts', selId, function (error, result) {
          $("#countmsg").text(result.msg);
          $("#count").css("width", result.wid);
          $("#availCount").show();
        });
        break;
      case 5:
        Meteor.call('getEventCounts', selId, function (error, result) {
          $("#countmsg").text(result.msg);
          $("#count").css("width", result.wid);
          $("#availCount").show();
        });
        break;
      case 6:
        $("#formdata").hide();
        $("#teamdata").show();
        break;
      default:
        $("#availCount").hide();
        break;
    }
  },

  'click #agreeBtn'(event) {
    event.preventDefault();
    agreeCond();
  },

  'click #disagreeBtn'(event) {
    event.preventDefault();
    disagreeCond();
  },

  'click #submitBtn'(event) {
    event.preventDefault();

    switch (parseInt($('#event').val())) {
      case 6:
        saveTeam();
        break;
      default:
        saveRunner();
        break;
    }
  },

  'input .validateInput'() {
    validateFormular($(this));
  },
  'change input[type=radio]'() {
    validateFormular();
  },
  'change input[type=checkbox]'() {
    validateFormular();
    if ($('#tb')[0].checked) $('#conditions').show();
  }
});


Template.emailVerification.helpers({

  /*check if OTP and email are correct */
  verifyToken() {

    var bOkay;
    var msg;
    var sucess = false;


    Meteor.call('checkToken', FlowRouter.getQueryParam("email"), FlowRouter.getQueryParam("otp"), function (error, result) {
      bOkay = result;
      switch (result) {
        case 0:
          msg = "Du bist erfolgreich registriert!"
          sucess = true;
          break;
        case 1:
          msg = "eMail bereits registiert!"
          break;
        case 2:
          msg = "Registrierungstoken ungültig!"
          break;
        case 3:
          msg = "eMail-Adresse ungültig!"
          break;
      }

      if (sucess) {
        $("#successMsg").text(msg);
        $("#verificationTrue").show();
      } else {
        $("#errorMsg").text(msg);
        $("#verificationFalse").show();
      }
    });

    //var bOkay = Meteor.call('checkToken', FlowRouter.getQueryParam("email"), FlowRouter.getQueryParam("otp"));;

  },
});

/*
Template.registerform.events({
  'click button' (event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
*/

function saveTeam() {

  var oTeam = {};

  oTeam.teamname = htmlEscape($('#teamName').val());
  oTeam.teamemail = htmlEscape($('#teamEmail').val());
  oTeam.starter1 = htmlEscape($('#starter1').val());
  oTeam.starter2 = htmlEscape($('#starter2').val());
  oTeam.starter3 = htmlEscape($('#starter3').val());
  oTeam.starter4 = htmlEscape($('#starter4').val());

  //check if TeamName already exists
  if (Team.findOne({
    teamname: oTeam.teamname
  })) {
    $('#errorMsg').text("Team " + oTeam.teamname + " ist bereits angemeldet");
    $('#id02').show();
    return;
  }

  var countAll = Team.find({}).fetch().length;

  Team.insert({
    teamname: oTeam.teamname,
    teamemail: oTeam.teamemail,
    starter1: oTeam.starter1,
    starter2: oTeam.starter2,
    starter3: oTeam.starter3,
    starter4: oTeam.starter4,
    createdAt: new Date(),
    payed: false,
  }, function (error, result) {
    if (error) console.log(error); //info about what went wrong
    if (result) console.log(result); //the _id of new object if successful);
  });

  Meteor.call('sendEmail',
  1,
  oTeam.teamemail,
  'madeast.registration@madcross.de',
  'MadEast 2019 Online-Anmeldung',
  oTeam);

  $("#teamCount").text(countAll + 1);
  $('#id03').show();

}

function saveRunner() {
  var oRunner = {};

  oRunner.event = parseInt($('#event').val());
  oRunner.firstname = htmlEscape($('#firstName').val());
  oRunner.email = htmlEscape($('#eMail').val());
  oRunner.birthday = htmlEscape($('#dob-day :selected').val() + "." + $('#dob-month :selected').val() + "." + $('#dob-year :selected').val());
  oRunner.team = htmlEscape($('#team').val());
  oRunner.lastname = htmlEscape($('#lastName').val());
  oRunner.gender = htmlEscape($('input[name=gender]:checked').val());

  /* check if email already exist
  
  if (Runners.findOne({
    email: oRunner.email
  })) {
    $('#errorMsg').text("eMail-Adresse ist bereits angemeldet");
    $('#id02').show();
    return;
  }

  */

  var countAll = Runners.find({}).fetch().length;

  var randomizer = require('random-token');
  var token = randomizer(16);

  Runners.insert({
    event: oRunner.event,
    firstName: oRunner.firstname,
    lastName: oRunner.lastname,
    email: oRunner.email,
    team: oRunner.team,
    gender: oRunner.gender,
    birthday: oRunner.birthday,
    createdAt: new Date(),
    verified: false,
    payed: false,
    token: token
  }, function (error, result) {
    if (error) console.log(error); //info about what went wrong
    if (result) console.log(result); //the _id of new object if successful);
  });

  Meteor.call('sendEmail',
    0,
    oRunner.email,
    'madeast.registration@madcross.de',
    'MadEast 2019 Online-Anmeldung',
    oRunner);

  $("#runnersCount").text(countAll + 1);
  $('#id01').show();
}


function validateFormular(elem) {

  var selId = parseInt($("#event option:selected").val());

  if (selId == 6) {
    validateTeamRunForm();
  } else {

    var valid = false;
    var prog = 0;

    var
      b0 = $('#event').val(),
      b1 = $('#firstName').val().length > 0,
      b2 = $('#lastName').val().length > 0,
      b3 = $('#eMail').val().length > 0,
      b4 = $('input[name=gender]:checked').length > 0;

    //birthday
    b5 = $('#dob-day').val();
    b6 = $('#dob-month').val();
    b7 = $('#dob-year').val();

    //Teilnahmebedingungen
    b8 = $('#tb')[0].checked;

    prog = b0 ? prog = Math.round(100 / 9) : prog + 0;
    prog = b1 ? prog + Math.round(100 / 9) : prog + 0;
    prog = b2 ? prog + Math.round(100 / 9) : prog + 0;
    prog = b3 ? prog + Math.round(100 / 9) : prog + 0;
    prog = b4 ? prog + Math.round(100 / 9) : prog + 0;
    prog = b5 ? prog + Math.round(100 / 9) : prog + 0;
    prog = b6 ? prog + Math.round(100 / 9) : prog + 0;
    prog = b7 ? prog + Math.round(100 / 9) : prog + 0;
    prog = b8 ? prog + Math.round(100 / 9) : prog + 0;

    if (b0 && b1 && b2 && b3 && b4 && b5 && b6 && b7 && b8) {

      var dateStr = b7 + "-" + b6 + "-" + b5;
      if (moment(dateStr).isValid()) {
        valid = true;
      } else {
        $('#errorMsg').text("Dein Geburtsdatum [" + b5 + "." + b6 + "." + b7 + "] gibt es nicht!", 'danger');
        $('#id02').show();
        $('#dob-day').val("");
      }
      prog = 100;
    }

    $('#submitBtn').prop('disabled', !valid);
    $('#progress').text(prog + "%").css("width", prog + "%");
  }
}

/* validate the TeamRunFormular */
function validateTeamRunForm() {

  var valid = false;
  var prog = 0;

  var
    b0 = $('#event').val(),
    b1 = $('#teamName').val().length > 0,
    b2 = $('#teamEmail').val().length > 0,
    b3 = $('#starter1').val().length > 0,
    b4 = $('#starter2').val().length > 0,
    b5 = $('#starter3').val().length > 0,
    b6 = $('#starter4').val().length > 0,
    //Teilnahmebedingungen
    b7 = $('#tb')[0].checked;

  prog = b0 ? prog = Math.round(100 / 8) : prog + 0;
  prog = b1 ? prog + Math.round(100 / 8) : prog + 0;
  prog = b2 ? prog + Math.round(100 / 8) : prog + 0;
  prog = b3 ? prog + Math.round(100 / 8) : prog + 0;
  prog = b4 ? prog + Math.round(100 / 8) : prog + 0;
  prog = b5 ? prog + Math.round(100 / 8) : prog + 0;
  prog = b6 ? prog + Math.round(100 / 8) : prog + 0;
  prog = b7 ? prog + Math.round(100 / 8) : prog + 0;

  if (b0 && b1 && b2 && b3 && b4 && b5 && b6 && b7) {
    valid = true;
    prog = 100;
  }

  $('#submitBtn').prop('disabled', !valid);
  $('#progress').text(prog + "%").css("width", prog + "%");

}

function htmlEscape(str) {
  return str.replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ROUTES
FlowRouter.route('/', {
  name: 'Start',
  action() {
    BlazeLayout.render('registerform', {
      main: 'Register_Page'
    });
  }
});

FlowRouter.route('/verify/', {
  name: 'Verify',
  action() {
    BlazeLayout.render('emailVerification', {
      main: 'Verification_Page'
    });
  }
});

FlowRouter.route('/results/', {
  name: 'Results',
  action() {
    BlazeLayout.render('results', {
      main: 'Result_Page'
    });
  }
});

FlowRouter.route('/listrunners/', {
  name: 'List',
  action() {
    BlazeLayout.render('runnersListTemplate', {
      main: 'List_Page'
    });
  }
});


FlowRouter.route('/listteams/', {
  name: 'TeamList',
  action() {
    BlazeLayout.render('teamListTemplate', {
      main: 'List_Page'
    });
  }
});

FlowRouter.route('/starterpage/', {
  name: 'StarterPage',
  action() {
    BlazeLayout.render('starterTemplate', {
      main: 'List_Page'
    });
  }
});

FlowRouter.route('/stoperpage/', {
  name: 'StopperPage',
  action() {
    BlazeLayout.render('stoperTemplate', {
      main: 'List_Page'
    });
  }
});

FlowRouter.route('/resultpage/', {
  name: 'ResultPage',
  action() {
    BlazeLayout.render('resultsTemplate', {
      main: 'List_Page'
    });
  }
});

function disagreeCond() {
  document.getElementById('conditions').style.display = 'none';
  $("#tb").attr("checked", false);
  validateFormular();
}

function agreeCond() {
  document.getElementById('conditions').style.display = 'none';
}


