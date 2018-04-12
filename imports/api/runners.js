import { Mongo } from 'meteor/mongo';

export const Runners = new Mongo.Collection('runners');


if (Meteor.isServer) {

    console.log('Meteor act as Server');

    Meteor.publish('runners', function () {    
        return Runners.find({});
    });
}
