import './starterpage.html';
import './stoperpage.html';
import './components/topnavigation.html';
import './components/passedStarters.html';
import './components/currentRunnings.html';

import {
    Runners
} from '../../api/runners.js';

const STATUS = {
    OPEN: 0,
    RUNNING: 1,
    FINISHED: 2,
    ESCAPED: 4
};
const EVENTS = {
    ENDURO: 1,
    RUNNING: 1,
    ESCAPED: 4
};

var timer = new Chronos.Timer(1000);


var commonHelpers = {
    wpUser() {
        if (Meteor.user() && ['WP1', 'WP2', 'WP3', 'WP4', 'WP5'].includes(Meteor.user().username)) {
            Session.set("WP", Meteor.user().username);
            return true;
        }
        return false;
    },

    wp() {
        switch (Meteor.user().username) {
            case "WP1":
                return "Wertungspunkt 1";
            case "WP2":
                return "Wertungspunkt 2";
            case "WP3":
                return "Wertungspunkt 3";
            case "WP4":
                return "Wertungspunkt 4";
            case "WP5":
                return "Wertungspunkt 5";
            default:
                return "User keinem WP zugeordnet";
        }
    }
};


Template.starterTemplate.onCreated(function () {

    Meteor.subscribe('runners');
    Session.set("time", 0);
    Session.set("starterSelected", "");
});

Template.stoperTemplate.onCreated(function () {

    Meteor.subscribe('runners');
    timer.start();

});

Template.currentRunnings.onCreated(function () {

    Meteor.subscribe('runners');
    timer.start();
});

Template.starterTemplate.helpers(commonHelpers);
Template.stoperTemplate.helpers(commonHelpers);

Template.starterTemplate.helpers({

    openRunners() {

        return Runners.find({
            event: EVENTS.ENDURO,
            [Session.get("WP") + "status"]: {
                $exists: false
            },
            payed: true
        });
    },

    //check if a starter is selected
    isStarterSelected() {
        return (Session.get("starterSelected").length > 0);
    },

    starterSelected() {
        let runner = Runners.findOne({
            _id: Session.get("starterSelected")
        });
        if (runner) {
            return runner.startnumber;
        }
    }
});

Template.stoperTemplate.helpers({

    currentRunnings() {

        Session.get("starterSelected");

        let currRunners = Runners.find({
            event: EVENTS.ENDURO,
            [Session.get("WP") + "status"]: STATUS.RUNNING,
            payed: true
        }, {
            sort: {
                [Session.get("WP") + "start"]: -1
            }
        }).fetch();

        return currRunners;
    },

  /*   getHeight() {

        let currRunnersCount = Runners.find({
            event: EVENTS.ENDURO,
            [Session.get("WP") + "status"]: STATUS.RUNNING,
            payed: true
        }, {
            sort: {
                [Session.get("WP") + "start"]: -1
            }
        }).fetch().length;

        let gridH = ($('.grid').height()) + "vh";
        console.log(gridH);
        return gridH;
    } */

});


Template.currentRunnings.helpers({

        currentRunnings() {

            Session.get("starterSelected");

            let currRunners = Runners.find({
                event: EVENTS.ENDURO,
                [Session.get("WP") + "status"]: STATUS.RUNNING,
                payed: true
            }, {
                sort: {
                    [Session.get("WP") + "start"]: -1
                }
            }).fetch();

            return currRunners;
        },

        duration(id) {

            let starter = Runners.findOne({
                _id: id
            });
            let startTime = starter[Session.get("WP") + "start"];
            return Math.round((timer.time.get().valueOf() - startTime) / 1000);
        }
    }),

    Template.passedStarters.helpers({

    });


Template.starterTemplate.events({

    // Used to toggle the menu on small screens when clicking on the menu button
    'click #logoutBtn'(event) {
        event.preventDefault();
        Meteor.logout();
    },

    'input #startnumber': function (event, template) {

        if (Number(event.currentTarget.value) != NaN) {
            $("#searchButton").css("color", "green");
        } else {
            Bert.alert("Startnummer ist keine Zahl!", 'danger');
            $("#searchButton").css("color", "gray");
        }
    },

    'click #searchButton'(event) {
        event.preventDefault();
        //find starter with existing startnumber and without existing time for this WP
        let starter = Runners.findOne({
            startnumber: $("#startnumber").val()
        });

        if (!starter) {
            Bert.alert("Startnummer existiert nicht!", 'danger');
            Session.set("starterSelected", "");
            return;
        }

        if (starter[Session.get("WP") + "time"]) {
            Bert.alert("Starter hat schon Resultat für " + Session.get("WP"), 'danger');
            Session.set("starterSelected", "");
        } else {
            Session.set("starterSelected", starter._id);
        }

        $("#startnumber").val("");
        $("#starterSelect").val("");
        $("#searchButton").css("color", "gray");
    },

    /*startnumber selected from dropdown list */
    'change #starterSelect'(event) {
        event.preventDefault();
        let starter = Runners.findOne({
            startnumber: $("#starterSelect").children("option:selected").val()
        });
        Session.set("starterSelected", starter._id);
        $("#startnumber").val("");
        $("#starterSelect").val("");
    },

    'click #startButton'(event) {
        event.preventDefault();

        if ($(event.currentTarget).hasClass('w3-disabled')) {
            return;
        } else {
            let startTime = new Date().valueOf();
            timer = new Chronos.Timer(1000);
            timer.start();
            saveTime(startTime, STATUS.RUNNING);
            Session.set("time", startTime);

            $("#startnumber").val("");
            $("#starterSelect").val("");
            Session.set("starterSelected", "");
        }
    },

    'click #resetButton'(event) {
        event.preventDefault();
        timer.stop();

        //let time = Math.round((timer.time.get().valueOf() - Session.get("time")) / 1000);
        saveTime(new Date().valueOf(), STATUS.FINISHED);
        // Session.set("starter", null);
        Session.set("time", 0);
    },

    'click #escButton'(event) {
        event.preventDefault();
        timer.stop();

        saveTime(-1, STATUS.ESCAPED);
        // Session.set("starter", null);
    },

    //delete race status of starter
    'click .resetStarter'(event) {
        event.preventDefault()
        resetStarter(event.currentTarget.dataset.starterid);
    }

});

Template.stoperTemplate.events({

    'click #logoutBtn'(event) {
        event.preventDefault();
        Meteor.logout();
    },

    'click #stopButton'(event) {
        event.preventDefault();
        timer.stop();

        //let time = Math.round((timer.time.get().valueOf() - Session.get("time")) / 1000);
        saveTime(new Date().valueOf(), STATUS.FINISHED);
        // Session.set("starter", null);
        Session.set("time", 0);
    },

    //delete race status of starter
    'click .resetStarter'(event) {
        event.preventDefault()
        resetStarter(event.currentTarget.dataset.starterid);
    }

});

function saveTime(time, status) {

    let set = {
        [Session.get("WP") + "status"]: status
    };
    let unset = {
        dummy: ""
    };

    switch (status) {
        case STATUS.RUNNING:
            set[Session.get("WP") + "start"] = time;
            break;
        case STATUS.FINISHED:
            set[Session.get("WP") + "stop"] = time;
            break;
        case STATUS.ESCAPED:
            break;
    }

    Runners.update(Session.get("starterSelected"), {
        $set: set,
        $unset: unset
    }, function (error, result) {
        if (error) {
            console.log(error);
        };
        if (result) {};
    });
}

function resetStarter(id) {

    new Confirmation({
        message: "Nochmal starten lassen?",
        title: "Starter zurücksetzen?",
        cancelText: "Nein",
        okText: "Ist okay!",
        success: true, // whether the button should be green or red
        focus: "cancel" // which button to autofocus, "cancel" (default) or "ok", or "none"
    }, function (ok) {
        if (ok) {
            Runners.update(id, {
                $unset: {
                    [Session.get("WP") + "start"]: "",
                    [Session.get("WP") + "stop"]: "",
                    [Session.get("WP") + "status"]: ""
                },
            }, function (error, result) {
                if (error) {
                    console.log(error);
                };
                if (result) {};
            });

            //reset the starter selection
            $("#starterSelect").val("");
        }
    });


}