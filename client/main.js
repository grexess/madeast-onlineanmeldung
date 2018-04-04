
//import { Template } from 'meteor/templating';
//import { ReactiveVar } from 'meteor/reactive-var';

import { Runners } from '../imports/api/runners.js';

//import './main.html';

Template.registerform.onCreated(function helloOnCreated() {
  console.log("Form created");
  // counter starts at 0
  //this.counter = new ReactiveVar(0);
});

Template.registerform.events({

  'click #submitBtn'(event) {
    event.preventDefault();

    console.log($('#firstName').val());
    console.log($('#lastName').val());

    Runners.insert({
      firstName: htmlEscape($('#firstName').val()),
      lastName: htmlEscape($('#lastName').val()),
      createdAt: new Date()
    });

    $("#runnersCount").text(Runners.find({}).fetch().length);
    $('#id01').show();
  },

  'input .validateInput'() { validateFormular(); },
  'change input[type=radio]'() { validateFormular(); }
});



/*
Template.formular.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.formular.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
*/

function validateFormular() {

  var valid = false;

  if ($('#firstName').val().length > 0 && $('#lastName').val().length > 0 && $('#eMail').val().length > 0 && $('input[name=gender]:checked').val().length > 0) {
    valid = true;
  }


  $('#submitBtn').prop('disabled', !valid);

}

function htmlEscape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}