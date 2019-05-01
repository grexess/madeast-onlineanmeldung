import './registerlist.html';

eventList = [
    "MAD Enduro",
    "MAD Nachwuchs",
    "MAD Crosscountry",
    "MAD 4er Team"
]

Template.registerlist.helpers({

    eventlist: function () {
        var x = ReactiveMethod.call("getRunners");
        return x;
    },
    teamlist: function () {
        var x = ReactiveMethod.call("getTeams");
        return x;
    }
}),

    Template.registerlist.onCreated(function () {

    });

Template.registerlist.events({

    'click .me-listitem'(event) {
        /* display/hide*/
        event.preventDefault();
        $('#registerUL').find('.member').hide('slow');
        $(event.currentTarget).next().show('slow');
        event.stopImmediatePropagation();
    }

})

