import './teamList.html';

import {
    Team
} from '../../../api/team.js';

prevClick = null;

if (Meteor.isClient) {

    Template.teamListTemplate.helpers({

        team() {
            return Team.find({});
        },

        formatBoolean(value) {
            if (value) {
                return "checked";
            } else { return ""; }
        },

        formatValue(value, check) {
            if (value == check) {
                return "selected";
            } else { return ""; }
        }

    });
}

Template.teamListTemplate.events({

    'change .selRowBtn'(event) {


        event.preventDefault();
        var selRow = $("#" + event.currentTarget.dataset.target);

        $("#" + $(".rTableBox").data("selectedRow")).removeClass("w3-blue");

        selRow.addClass("w3-blue");
        $(".rTableBox").data("selectedRow", event.currentTarget.dataset.target);

        $("#deleteBtn").show();
        $('#teamheader').text(selRow.find("#teamname").text());
        $('#headerTitle').text("Team ändern: ");

        $("input[name='teamname']").val(selRow.find("#teamname").text());
        $("input[name='teamemail']").val(selRow.find("#teamemail").text());
        $("input[name='startnumber']").val(selRow.find("#startnumber").text());
        $("input[name='time']").val(selRow.find("#time").text());
        $("input[name='starter1']").val(selRow.find("#starter1").text());
        $("input[name='starter2']").val(selRow.find("#starter2").text());
        $("input[name='starter3']").val(selRow.find("#starter3").text());
        $("input[name='starter4']").val(selRow.find("#starter4").text());

        $("input[name='payed']").prop('checked', selRow.find("#payed").prop("checked"));

        $("#saveBtn").data("id", event.currentTarget.dataset.target);
        $("#deleteBtn").data("id", event.currentTarget.dataset.target);

        document.getElementById('id01').style.display = 'block';
    },

    'click .actBtn'(event) {
        event.preventDefault();

        switch (event.currentTarget.dataset.action) {

            case "new":
                createTeam();
                return;
            case "save":
                saveTeam($("#saveBtn").data("id"));
                break;
            case "delete":
                deleteTeam($("#deleteBtn").data("id"));
                break;
            case "cancel":
                break;
            default:
                break;
        }
        document.getElementById('id01').style.display = 'none';
    },

    'focusout input[name="time"]'() {
        var re = /^([0-2][0-3]):([0-5][0-9]):([0-5][0-9])$/;
        if (re.test(String($("input[name='time']").val()).toLowerCase())) {
            $('input[name="time"]').removeClass("w3-red");
        } else {
            $('#id02').show();
            $('#errorMsg').text("Zeit hat kein gültiges Format (00:00:00)");
            $('input[name="time"]').focus().addClass("w3-red");
        }
    }
})

function htmlEscape(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function createTeam() {

    $("#" + $(".rTableBox").data("selectedRow")).removeClass("w3-blue");

    document.getElementById('id01').style.display = 'block';
    $('#id01').find("input").val("");
    $("input[name='payed']").prop('checked', false);

    $('#teamheader').text("");
    $('#headerTitle').text("Team anlegen");

    $("#saveBtn").data("id", null);
    $("#deleteBtn").hide();

}

function saveTeam(id) {

    var objToChange = {
        teamname: $("input[name='teamname']").val(),
        teamemail: $("input[name='teamemail']").val(),
        starter1: $("input[name='starter1']").val(),
        starter2: $("input[name='starter2']").val(),
        starter3: $("input[name='starter3']").val(),
        starter4: $("input[name='starter4']").val(),
        payed: $("input[name='payed']").prop("checked"),
        startnumber: $("input[name='startnumber']").val(),
        time: $("input[name='time']").val(),
    }

    if (id) {

        Team.update(id, {
            $set: objToChange,
        }, function (error, result) {
            if (error) Bert.alert("Team" + objToChange.teamname + " nicht gespeichert!", 'danger');
            if (result) {
                Bert.alert("Team" + objToChange.teamname + " gespeichert!", 'success');
            };
        });
    } else {
        Team.insert( objToChange , function (error, result) {
            if (error) Bert.alert("Team [" + objToChange.teamname + "] nicht angelegt!", 'danger');
            if (result) {
                Bert.alert("Team [" + objToChange.teamname + "] gespeichert!", 'success');
            };
        });
    }
}


function deleteTeam(id) {

    Team.remove(id
        , function (error, result) {
            if (error) Bert.alert($("input[name='teamname']").val() + " nicht gelöscht!", 'danger');
            if (result) {
                Bert.alert("Team " + $("input[name='teamname']").val() + " gelöscht", 'success');
            };
        });
    prevClick = null;
}