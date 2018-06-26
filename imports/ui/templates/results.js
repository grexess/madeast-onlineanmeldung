import './results.html';

Template.results.helpers({
    results: function () {
        var x = ReactiveMethod.call("getResults");

      

        return x;
    }
})

Template.childrenTemplate.helpers({

    children: function () {
        var obj = ReactiveMethod.call("getJuniorResults");

        var ak = [];

var collection;

        if (obj) {
            ak= checkCollection(getRunnersByYear(obj.female, "2012", "2013"),"AK1 [2012/13] Mädchen",ak);
            ak= checkCollection(getRunnersByYear(obj.male, "2012", "2013"),"AK1 [2012/13] Jungs",ak);
            ak= checkCollection(getRunnersByYear(obj.female, "2010", "2011"),"AK1 [2010/11] Mädchen",ak);
            ak= checkCollection(getRunnersByYear(obj.male, "2010", "2011"),"AK1 [2010/11] Jungs",ak);
            ak= checkCollection(getRunnersByYear(obj.female, "2008", "2009"),"AK1 [2008/09] Mädchen",ak);
            ak= checkCollection(getRunnersByYear(obj.male, "2008", "2009"),"AK1 [2008/09] Jungs",ak);
            ak= checkCollection(getRunnersByYear(obj.female, "2006", "2007"),"AK1 [2006/07] Mädchen",ak);
            ak= checkCollection(getRunnersByYear(obj.male, "2006", "2007"),"AK1 [2006/07] Jungs",ak);
        }

      /*   if (obj) {
            ak[0] = {
                ak: "AK1 [2012/13]",
                female: getRunnersByYear(obj.female, "2012", "2013"),
                male: getRunnersByYear(obj.male, "2012", "2013")
            };
            ak[1] = {
                ak: "AK2 [2010/11]",
                female: getRunnersByYear(obj.female, "2010", "2011"),
                male: getRunnersByYear(obj.male, "2010", "2011")
            };
            ak[2] = {
                ak: "AK3 [2008/09]",
                female: getRunnersByYear(obj.female, "2008", "2009"),
                male: getRunnersByYear(obj.male, "2008", "2009")
            };
            ak[3] = {
                ak: "AK4 [2006/07]",
                female: getRunnersByYear(obj.female, "2006", "2007"),
                male: getRunnersByYear(obj.male, "2006", "2007")
            };
            ak[4] = {
                ak: "AK5 [2004/05]",
                female: getRunnersByYear(obj.female, "2004", "2005"),
                male: getRunnersByYear(obj.male, "2004", "2005")
            };
        } */
        return ak;
    }
})


Template.teamresult.helpers({
    teamresults: function () {
        //var x = ReactiveMethod.call("getTeamResult");
        x= [];
        x[0] = {"place": 1, "startnumber": "Team4" , "rounds":20, "teamname":"MassiveDipps"};
        x[1] = {"place": 2, "startnumber": "Team1" , "rounds":19, "teamname":"Hofmann Group"};
        x[2] = {"place": 3, "startnumber": "Team3" , "rounds":18, "teamname":"Auffallen durch Umfallen"};
        x[3] = {"place": 4, "startnumber": "Team2" , "rounds":15, "teamname":"Ball(er)männer"};
        return x;
    },
})

Template.crosscountry.helpers({
    crossresults: function () {
        //var x = ReactiveMethod.call("getTeamResult");
        x= [];
        x[0] = {"place": 1, "startnumber": 359 , "rounds":23, "firstname":"Paul","lastname":"Irmscher"};
        x[1] = {"place": 2, "startnumber": 355 , "rounds":23, "firstname":"Jens","lastname":"Hotho"};
        x[2] = {"place": 3, "startnumber": 360 , "rounds":21, "firstname":"Alexander","lastname":"Altherr"};
        x[3] = {"place": 4, "startnumber": 358 , "rounds":19, "firstname":"Köhler","lastname":"Achim"};
        x[4] = {"place": 5, "startnumber": 352 , "rounds":17, "firstname":"Manuel","lastname":"Meschkank"};
        x[4] = {"place": 6, "startnumber": 356 , "rounds":15, "firstname":"Jehnichen","lastname":"Erik"};
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

    'click .navBtn' (event) {
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

    'click .genderBtn' (event) {
        event.preventDefault();
        var x = $("#" + event.currentTarget.dataset.target);
        var y = $("#" + event.currentTarget.dataset.opposite);

        if (x.hasClass("zhide")) {
            x.removeClass("zhide").addClass("zshow");
            y.removeClass("zshow").addClass("zhide");
            $("[data-target='" + event.currentTarget.dataset.target + "']").addClass("w3-blue");
            $("[data-target='" + event.currentTarget.dataset.opposite + "']").removeClass("w3-blue");
        } else {

        }

    }
})

// Template.event.onRendered(function () {
//     setInterval(function() { 
//         $("#zlist").find('li')[0]
//           .animate({ backgroundColor: "#9a5342" }, 3000)
//           .animate({ backgroundColor: "#fffc0c" }, 3000)
//           .animate({ backgroundColor: "#e46d00" }, 3000)
//           .animate({ backgroundColor: "#ff3506" }, 3000);
//   },100);
// })


function getRunnersByYear(array, start, end) {

    var ak = [];

    var minDate = new Date(start, 0);
    var maxDate = new Date(end, 12);

    $(array).each(function (index, value) {

        var birthday = new Date(parseInt(value.birthday.substring(6, 10)), parseInt(value.birthday.substring(3, 5)) - 1, parseInt(value.birthday.substring(0, 2)));
        if (birthday >= minDate && birthday < maxDate) {
            ak.push(value);
        }
    });

    $(ak).each(function (index, value) {
        value.place = index + 1;
    });

    return ak;
}

function checkCollection(collection, text, array){
    if(collection.length > 0){
        array.push( {
            ak: text,
            coll: collection
        })
    }
    return array;
}