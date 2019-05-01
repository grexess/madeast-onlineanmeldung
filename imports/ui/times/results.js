import './results.html';
import {
    Runners
} from '../../api/runners.js';

Template.resultsTemplate.onCreated(function () {
    Meteor.subscribe('runners');
});

Template.resultsTemplate.helpers({

    getTimeProperty(obj, wp) {
        return obj[wp + "time"];
    },

    routes() {
        return ["WP1", "WP2", "WP3", "WP4", "WP5"];
    },

    opens() {
        return Runners.find({
            status: 0
        });
    },

    escaped() {
        return Runners.find({
            status: 4
        });
    },

    runnings() {
        return Runners.find({
            status: 1
        });
    },

    finalized(wp) {

        let resulttime = wp + "time";

        return Runners.find({
            status: 2,
            [resulttime]: {
                $gt: 0
            }
        });
    },

});