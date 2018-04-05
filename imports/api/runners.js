import { Mongo } from 'meteor/mongo';

export const Runners = new Mongo.Collection('runners');


if (Meteor.isServer) {

    console.log('isServer1');

    Meteor.publish('runners', function () {    
        return Runners.find({});
    });
}
