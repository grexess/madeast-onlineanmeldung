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

const aRoutes = ["WP1", "WP2", "WP3", "WP4", "WP5"];

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
        return moment().startOf('day').seconds(Math.round((obj[wp + "stop"] - obj[wp + "start"]) / 1000)).format('HH:mm:ss');
    },

    getStartTime(obj) {
        return new Date(obj[obj.currentWP + "start"]).toLocaleString();
    },

    getElapsedTime(obj) {
        return moment().startOf('day').seconds(Math.round((timer.time.get().valueOf() - obj[obj.currentWP + "start"]) / 1000)).format('HH:mm:ss');
    },

    routes() {
        return aRoutes;
    },

    getCurrStarterPerRoute(wp) {
        let runner = Runners.findOne({
            [wp + "status"]: STATUS.RUNNING
        });
        return runner;
    },

    getCurrRunTimePerStarter(wp, starter) {
        return Math.round((timer.time.get().valueOf() - starter[wp + "start"]) / 1000);
    },

    getFinisherPerRoute(wp) {

        let list = Runners.find({
            [wp + "status"]: STATUS.FINISHED
        }).fetch().sort(function compareTimes(runnerA, runnerB) {

            let timeRunnerA = Math.round((runnerA[wp + "stop"] - runnerA[wp + "start"]) / 1000);
            let timeRunnerB = Math.round((runnerB[wp + "stop"] - runnerB[wp + "start"]) / 1000);

            if (timeRunnerA < timeRunnerB) {
                return -1;
            }
            if (timeRunnerA > timeRunnerB) {
                return 1;
            }
            return 0;
        });
        Session.set("list" + wp, list);
        return Session.get("list" + wp);
    },

    getPostion(idx) {
        return idx + 1;
    },

    getFinishedTimePerStarter(wp, starter) {
        return Math.round((starter[wp + "stop"] - starter[wp + "start"]) / 1000);
    },

    getFinishedPlacePerStarter(wp, starter) {

        let idx = Session.get("list" + wp).findIndex(function (element, starter) {
            return element._id == this._id;
        }, starter);

        return idx + 1

    },

    getFinisherAllRoutes() {

        let finishers = Runners.find({
            WP1status: STATUS.FINISHED,
            WP2status: STATUS.FINISHED,
            WP3status: STATUS.FINISHED,
            WP4status: STATUS.FINISHED,
            WP5status: STATUS.FINISHED,
        }).fetch();

        finishers.forEach(function (finisher) {
            finisher.total = sumAllWPTimes(finisher);
        });

        return finishers;
    },

    escaped() {
        return Runners.find({
            $or: [{
                WP1status: STATUS.ESCAPED
            }, {
                WP2status: STATUS.ESCAPED
            }, {
                WP3status: STATUS.ESCAPED
            }, {
                WP4status: STATUS.ESCAPED
            }, {
                WP5status: STATUS.ESCAPED
            }]
        });
    },

    finalized(wp) {

        let finisher = Runners.find({
            [wp + "status"]: STATUS.FINISHED,
            [wp + "stop"]: {
                $exists: true
            }
        });

        return finisher;

    },

});

function sumAllWPTimes(starter) {
    let total = 0;
    aRoutes.forEach(function (wp) {
        total = total + Math.round((starter[wp + "stop"] - starter[wp + "start"]) / 1000);
    });
    return total;
}