import './registerlist.html';

eventList = [
    "MAD Enduro",
    "MAD HALL4X",
    "MAD Nachwuchs",
    "MAD Crosscountry"
]

Template.registerlist.helpers({

}),

Template.registerlist.onCreated(function () {

});

Template.registerlist.events({

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

    'click .me-listitem' (event) {

        event.preventDefault();
        $('#registerUL').find('.member').hide('slow');

        //add the users here

        $(event.currentTarget).next().show('slow');
        //$('.member').removeClass('me-hidemember').addClass('me-showmember');
        event.stopImmediatePropagation();
    }

})

