import { Mongo } from 'meteor/mongo';

export const Team = new Mongo.Collection('team');


if (Meteor.isServer) {

    Meteor.publish('team', function () {    
        return Team.find({});
    });
}
