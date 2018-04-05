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
      alert(true);
    } else {
      alert(false);
    }
},

'click #submitBtn' (event) {
  event.preventDefault();

  var firstName = htmlEscape($('#firstName').val());
  var email = htmlEscape($('#eMail').val());
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
  });

  Meteor.call('sendEmail',
    'grexess@googlemail.com',
    'madeast.registration@madcross.de',
    'MadEast 2018 Online-Anmeldung',
    'Hallo ' + firstName + '! Bitte folgenden Link zur Adressprüfung anklicken: ' + $(document).context.URL + 'verify?otp=' + token + '&email=' + email);

  $("#runnersCount").text(Runners.find({}).fetch().length);
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

    var email = FlowRouter.getQueryParam("email");

    var x = Runners.find(email).fetch();

    var bOkay = true;

    //find element with email
    var record = Runners.find({
      "email": email
    }).fetch()[0];

    //get token of this element

    //compare tokens

    if (bOkay) {
      return "<H1>True</H1>";
    } else {
      return "<H1>FALSE</H1>";
    }
    //alert(FlowRouter.getQueryParam("otp"));
    //alert(FlowRouter.getQueryParam("email"));
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