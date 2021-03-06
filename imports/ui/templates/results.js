import './results.html';

Template.results.helpers({
    results: function () {
        var x = ReactiveMethod.call("getResults");
        return x;
    }
})

Template.teamresult.helpers({
    teamresults: function () {
        var x = ReactiveMethod.call("getTeamResult");
        return x;
    },
})

Template.teamresult.helpers({

    getPlace(value) {
        return value + 1;
    }
})


Template.event.helpers({

    getPlace(value) {
        return value + 1;
    }
})

Template.results.events({

    'click .navBtn'(event) {
        event.preventDefault();
        var x = $("#tab" + event.currentTarget.id);
        var y = $("#ic" + event.currentTarget.id);

        if (x.hasClass("w3-show")) {
            x.removeClass("w3-show").addClass("w3-hide");
            //x.prev().removeClass("w3-theme-d1").addClass("w3-theme-d4");
            y.removeClass("fa-caret-down").addClass("fa-caret-right");
        } else {
            x.removeClass("w3-hide").addClass("w3-show");
            //x.prev().removeClass("w3-theme-d4").addClass("w3-theme-d1");
            y.removeClass("fa-caret-right").addClass("fa-caret-down");
        }
    },

    'click .genderBtn'(event) {
        event.preventDefault();
        var x = $("#" + event.currentTarget.dataset.target);
        var y = $("#" + event.currentTarget.dataset.opposite);

        if(x.hasClass("w3-hide")){
            x.removeClass("w3-hide").addClass("w3-show");
            y.removeClass("w3-show").addClass("w3-hide");
            $("[data-target='"+ event.currentTarget.dataset.target+"']").addClass("w3-blue");
            $("[data-target='"+ event.currentTarget.dataset.opposite+"']").removeClass("w3-blue");
        }else{
           
        }

    }
})

function toggleElement(id) {


}