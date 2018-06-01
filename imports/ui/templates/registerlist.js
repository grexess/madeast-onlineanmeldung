import './registerlist.html';

eventList = [
    "MAD Enduro",
    "MAD HALL4X",
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

    /*
    'click #registerUL'(event) {
        event.preventDefault();
        //clear list
        $('#registerUL').empty();

        Meteor.call('getEventStatus', function (error, result) {
            var i;
            for (i = 0; i < eventList.length; i++) {

                var myLi = $("<li class=\"w3-bar me-listitem\"><div><b>" + eventList[i] + "</b></div><div class=\"me-regist w3-bar-item\"><span class=\"w3-badge w3-red\">" + result[i][0] + "</span> Registrierungen</div><div class=\"w3-bar-item\"><span class=\"w3-badge w3-green\">" + result[i][1] + "</span> bestätigte Überweisungen</div></li>")
                $('#registerUL').append(myLi);
                var myLiMember = $("<li style=\"display:none\" class=\"w3-bar member\"><div><b>Bestätigte Teilnehmer</b></div></li>");
                $('#registerUL').append(myLiMember);
            }
        });
    },
*/

    'click .me-listitem'(event) {
        /* display/hide*/
        event.preventDefault();
        $('#registerUL').find('.member').hide('slow');
        $(event.currentTarget).next().show('slow');
        event.stopImmediatePropagation();
    }

})

