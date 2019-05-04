import './results.html';
import {
    Runners
} from '../../api/runners.js';


const STATUS = {
    OPEN: 0,
    RUNNING: 1,
    FINISHED: 2,
    ESCAPED: 4
};

var timer = new Chronos.Timer(1000);

Template.resultsTemplate.onCreated(function () {
    Meteor.subscribe('runners');
    timer.start();
});

Template.resultsTemplate.helpers({

    getStartTimeProperty(obj, wp) {
        return obj[wp + "start"];
    },

    getTotalTimeProperty(obj, wp) {
        return moment().startOf('day').seconds(Math.round((obj[wp+ "stop"] - obj[wp+ "start"]) / 1000)).format('HH:mm:ss');
    },

    getStartTime(obj) {
        return new Date(obj[obj.currentWP + "start"]).toLocaleString();
    },

    getElapsedTime(obj) {
       return moment().startOf('day').seconds(Math.round((timer.time.get().valueOf() - obj[obj.currentWP + "start"]) / 1000)).format('HH:mm:ss');
    },

    routes() {
        return ["WP1", "WP2", "WP3", "WP4", "WP5"];
    },

    opens() {
        return Runners.find({
            status: STATUS.OPEN
        });
    },

    escaped() {
        return Runners.find({
            status: STATUS.ESCAPED
        });
    },

    runnings() {
        return Runners.find({
            status: STATUS.RUNNING
        });
    },

    finalized(wp) {

        return Runners.find({
            status: STATUS.FINISHED,
            [wp + "stop"]: {
                $exists: true
            }
        });
    },

});