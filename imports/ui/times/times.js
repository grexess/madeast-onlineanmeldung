import './times.html';
import {
    Runners
} from '../../api/runners.js';

var timer = new Chronos.Timer(1000);

Template.timerTemplate.onCreated(function () {
    Meteor.subscribe('runners');
    Session.set("start", 0);
});

Template.timerTemplate.helpers({

    runners() {
        return Runners.find({});
    },

    duration() {
        let time = Math.round((timer.time.get().valueOf() - Session.get("start")) / 1000);
        saveTime(time, 1, false);
        return time;
    },

    starter() {
        return Session.get("starter");
    }

});

Template.timerTemplate.events({

    'click #searchButton'(event) {
        event.preventDefault();
        //find starter with existing startnumber and without existing time for this WP
        let starter = Runners.findOne({
            startnumber: $("#startnumber").val()
        });

        let wptime = $("#wp option:selected").val() + "time";

        if (!starter) {
            Bert.alert("Startnummer existiert nicht!", 'danger');
            Session.set("starter", null);
            return;
        }

        if (starter[wptime]) {
            Bert.alert("Starter hat schon Resultat für " + $("#wp option:selected").val(), 'danger');
            Session.set("starter", null);
        } else {
            Session.set("starter", starter);
        }
    },

    'click #startButton'(event) {
        event.preventDefault();
        Session.set("start", new Date().valueOf());
        timer = new Chronos.Timer(1000);
        timer.start();
    },


    'click #stopButton'(event) {
        event.preventDefault();
        timer.stop();

        let time = Math.round((timer.time.get().valueOf() - Session.get("start")) / 1000);
        saveTime(time, 2, true);
        Session.set("starter", null);
    },

    'click #escButton'(event) {
        event.preventDefault();
        timer.stop();

        saveTime(-1, 4, true);
        Session.set("starter", null);
    }

});

function saveTime(time, status, isfinal) {

    let route = $("#wp option:selected").val();
    key = "currenttime";
    if (isfinal) {
        key = route + "time"
    }

    Runners.update(Session.get("starter")._id, {
        $set: {
            [key]: time,
            status: status,
            route: route
        },
    }, function (error, result) {
        if (error) {
            console.log(error);
        };
        if (result) {};
    });
}