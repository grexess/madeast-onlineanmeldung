import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import '../imports/api/runners.js';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    //check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  }
});
