import {
  Meteor
} from 'meteor/meteor';
import {
  Email
} from 'meteor/email';
import '../imports/api/runners.js';

import {
  Runners
} from '../imports/api/runners.js';

Meteor.startup(() => {
  // code to run on server at startup
});

Runners.allow({
  'insert': function (userId,doc) {
    /* user and doc checks ,
    return true to allow insert */
    return true; 
  }
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
  },

  checkToken: function (email, token) {

    console.log("Verify email [" + email + "] and token [" + token + "]");

    var x = Runners.find({
      email: email
    }).fetch();

    console.log("email count:" + x.length);

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