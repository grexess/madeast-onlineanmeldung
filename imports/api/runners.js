import { Mongo } from 'meteor/mongo';

export const Runners = new Mongo.Collection('runners');


if (Meteor.isServer) {

    console.log('isServer');

    Meteor.publish('runners', function () {
        return Runners.find({});
    });
}