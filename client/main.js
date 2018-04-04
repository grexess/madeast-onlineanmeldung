
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

    console.log( $('#firstName').val());
    console.log( $('#lastName').val());

    Runners.insert({
      firstName: htmlEscape($('#firstName').val()),
      lastName: htmlEscape($('#lastName').val()),
      createdAt: new Date()
    });
  }

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

function htmlEscape(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}