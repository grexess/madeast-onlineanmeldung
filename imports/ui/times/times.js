import './starterpage.html';
import './stoperpage.html';
import './components/topnavigation.html';
import './components/passedStarters.html';

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
                return "WP1 - Irgendwo";
            case "WP2":
                return "WP2 - Irgendwo";
            case "WP3":
                return "WP3 - Irgendwo";
            case "WP4":
                return "WP4 - Irgendwo";
            case "WP5":
                return "WP5 - Irgendwo";
            default:
                return "User keinem WP zugeordnet";
        }
    }
};


Template.starterTemplate.onCreated(function () {

    Meteor.subscribe('runners');
    Session.set("time", 0);
});

Template.stoperTemplate.onCreated(function () {

    Meteor.subscribe('runners');
    timer.start();

});

Template.starterTemplate.helpers(commonHelpers);
Template.stoperTemplate.helpers(commonHelpers);

Template.starterTemplate.helpers({

    openRunners() {

        return Runners.find({
            event: EVENTS.ENDURO,
            [Session.get("WP") +"status"]: {
                $exists: false
            },
            payed: true
        });
    },



    duration() {
        let time = Math.round((timer.time.get().valueOf() - Session.get("time")) / 1000);
        return time;
    },

    starter() {
        return Session.get("starter");
    },

    //check if a starter is running on cuurent route
    isStarted() {

        let starter = Runners.findOne({
            [Session.get("WP") +"status"]: STATUS.RUNNING,
        });

        if (starter) {
            return true;
        }
        return false;
    }

});

Template.stoperTemplate.helpers({

    //check if there is a starter with status running
    starter() {

        let starter = Runners.findOne({
            [Session.get("WP") + "status"]: STATUS.RUNNING,
        });
        Session.set("starter", starter);

        return Session.get("starter");
    },

    duration() {
        let startTime = Session.get("starter")[Session.get("WP") + "start"];
        return Math.round((timer.time.get().valueOf() - startTime) / 1000);
    }

});

Template.passedStarters.helpers({

    alreadyStarted() {

        let aRunners = Runners.find({
            event: EVENTS.ENDURO,
            [Session.get("WP") + "status"]: {
                $gt: 1
            }
        });

        //check if the current starter is now in the finished starter list so UI can be reset
        let array = aRunners.fetch();

        if (Session.get("starter")) {
            let localStarterID = Session.get("starter")._id;
            var result = array.findIndex(obj => obj._id === localStarterID);

            if(result != -1){
                /*local starter was stopped by another client */
                Bert.alert("Startnummer " + Session.get("starter").startnumber + " hat Rennen beendet!", 'success');
                //reset the starter selection
                $("#starterSelect").val("");
                Session.set("starter", null);
            }

        }

        return aRunners;

    },
});


Template.starterTemplate.events({

    // Used to toggle the menu on small screens when clicking on the menu button
    'click #logoutBtn'(event) {
        event.preventDefault();
        Meteor.logout();
    },

    'click #searchButton'(event) {
        event.preventDefault();
        //find starter with existing startnumber and without existing time for this WP
        let starter = Runners.findOne({
            startnumber: $("#startnumber").val()
        });

        if (!starter) {
            Bert.alert("Startnummer existiert nicht!", 'danger');
            Session.set("starter", null);
            return;
        }

        if (starter[Session.get("WP") + "time"]) {
            Bert.alert("Starter hat schon Resultat für " + Session.get("WP"), 'danger');
            Session.set("starter", null);
        } else {
            Session.set("starter", starter);
        }

        $("#startnumber").val("");
    },

    'change #starterSelect'(event) {
        event.preventDefault();
        let starter = Runners.findOne({
            startnumber: $("#starterSelect").children("option:selected").val()
        });
        Session.set("starter", starter);
    },

    'click #startButton'(event) {
        event.preventDefault();
        let startTime = new Date().valueOf();
        timer = new Chronos.Timer(1000);
        timer.start();
        saveTime(startTime, STATUS.RUNNING);
        Session.set("time", startTime);
    },


    'click #stopButton'(event) {
        event.preventDefault();
        timer.stop();

        //let time = Math.round((timer.time.get().valueOf() - Session.get("time")) / 1000);
        saveTime(new Date().valueOf(), STATUS.FINISHED);
        Session.set("starter", null);
        Session.set("time", 0);
    },

    'click #escButton'(event) {
        event.preventDefault();
        timer.stop();

        saveTime(-1, STATUS.ESCAPED);
        Session.set("starter", null);
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
        Session.set("starter", null);
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
        [Session.get("WP") + "status"] : status 
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

    Runners.update(Session.get("starter")._id, {
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