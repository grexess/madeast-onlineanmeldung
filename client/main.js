//import { Template } from 'meteor/templating';
//import { ReactiveVar } from 'meteor/reactive-var';

import {
  Runners
} from '../imports/api/runners.js';

//import './main.html';

import '../imports/ui/templates/verify.html';
import '../imports/ui/templates/birthday.html';
import '../imports/ui/templates/register.html';
import '../imports/ui/templates/private/runnersList.html';
import '../imports/ui/templates/private/login.html';
import '../imports/ui/templates/private/runnersList.js';

import '../imports/startup/accounts-config.js';

Template.registerform.onCreated(function helloOnCreated() {
  console.log("Form created");
  Meteor.subscribe('runners');
  // counter starts at 0
  //this.counter = new ReactiveVar(0);
});

Template.emailVerification.onCreated(function () {
  console.log("Verify Page created");
  Meteor.subscribe('runners');
});

Template.runnersListTemplate.onCreated(function () {
  console.log("List Page created");
  Meteor.subscribe('runners');
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

    var oRunner = {};

    oRunner.event = htmlEscape($('#event').val());
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
      oRunner.email,
      'madeast.registration@madcross.de',
      'MadEast 2018 Online-Anmeldung',
      oRunner);

    $("#runnersCount").text(countAll + 1);
    $('#id01').show();

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


function validateFormular(elem) {

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

FlowRouter.route('/listrunners/', {
  name: 'List',
  action() {
    BlazeLayout.render('runnersListTemplate', {
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

