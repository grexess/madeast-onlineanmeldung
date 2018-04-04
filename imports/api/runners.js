import { Mongo } from 'meteor/mongo';

export const Runners = new Mongo.Collection('runners');


if (Meteor.isServer) {
    Meteor.publish('runners', function () {
        return Runners.find({});
    });

    Runners.allow({
		insert: function (userId, doc) {
			return true;
		}
	});

}