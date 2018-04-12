//import { Template } from 'meteor/templating';
//import { ReactiveVar } from 'meteor/reactive-var';

import {
  Runners
} from '../imports/api/runners.js';

//import './main.html';

import '../imports/ui/templates/verify.html';
import '../imports/ui/templates/birthday.html';
import '../imports/ui/templates/register.html';


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

Template.registerform.events({

  'focusout #eMail' () {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String($('#eMail').val()).toLowerCase())) {
      //alert(true);
    } else {
      $('#errorMsg').text("eMail-Adresse hat kein gültiges Format");
      $('#id02').show();
    }
  },

  'click #submitBtn' (event) {
    event.preventDefault();

    var firstName = htmlEscape($('#firstName').val());
    var email = htmlEscape($('#eMail').val());

    if (Runners.findOne({
        email: email
      })) {
      $('#errorMsg').text("eMail-Adresse ist bereits angemeldet");
      $('#id02').show();
      return;
    }

    var countAll = Runners.find({}).fetch().length;
    //console.log("already registered");

    var birthday = birthday = htmlEscape($('#dob-day :selected').val() + "." + $('#dob-month :selected').val() + "." + $('#dob-year :selected').val());
    var randomizer = require('random-token');
    var token = randomizer(16);

    Runners.insert({
      firstName: firstName,
      lastName: htmlEscape($('#lastName').val()),
      email: email,
      team: htmlEscape($('#team').val()),
      gender: htmlEscape($('input[name=gender]:checked').val()),
      birthday: birthday,
      createdAt: new Date(),
      verified: false,
      payed: false,
      token: token
    }, function (error, result) {
      if (error) console.log(error); //info about what went wrong
      if (result) console.log(result); //the _id of new object if successful);
    });

    Meteor.call('sendEmail',
      'grexess@googlemail.com',
      'madeast.registration@madcross.de',
      'MadEast 2018 Online-Anmeldung',
      'Hallo ' + firstName + '! Bitte folgenden Link zur Adressprüfung anklicken: ' + $(document).context.URL + 'verify?otp=' + token + '&email=' + email);

    $("#runnersCount").text(countAll + 1);
    $('#id01').show();

  },

  'input .validateInput' () {
    validateFormular($(this));
  },
  'change input[type=radio]' () {
    validateFormular();
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
    b1 = $('#firstName').val().length > 0,
    b2 = $('#lastName').val().length > 0,
    b3 = $('#eMail').val().length > 0,
    b4 = $('input[name=gender]:checked').length > 0;

  //birthday
  b5 = $('#dob-day').val();
  b6 = $('#dob-month').val();
  b7 = $('#dob-year').val();

  prog = b1 ? prog = Math.round(100 / 7) : prog + 0;
  prog = b2 ? prog + Math.round(100 / 7) : prog + 0;
  prog = b3 ? prog + Math.round(100 / 7) : prog + 0;
  prog = b4 ? prog + Math.round(100 / 7) : prog + 0;
  prog = b5 ? prog + Math.round(100 / 7) : prog + 0;
  prog = b6 ? prog + Math.round(100 / 7) : prog + 0;
  prog = b7 ? prog + Math.round(100 / 7) : prog + 0;

  if (b1 && b2 && b3 && b4 && b5 && b6 && b7) {
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

FlowRouter.route('/ListRunners/', {
  name: 'List',
  action() {
    BlazeLayout.render('listRunners', {
      main: 'List_Page'
    });
  }
});