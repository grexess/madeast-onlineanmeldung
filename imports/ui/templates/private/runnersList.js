import './runnersList.html';

import {
    Runners
} from '../../../api/runners.js';

prevClick = null;

if (Meteor.isClient) {

    Template.runnersListTemplate.helpers({

        runners() {
            return Runners.find({});
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

    Template.runnersListTemplate.onCreated(function () {

    });


    Template.runnersListTemplate.events({

        'click .actBtn'(event) {
            event.preventDefault();

            switch (event.currentTarget.dataset.action) {
                case "save":
                    saveRunner(event.currentTarget.dataset.rowid)
                    break;
                case "delete":
                    deleteRunner(event.currentTarget.dataset.rowid)
                    break;
                case "create":
                    createRunner()
                    break;
                default:
                    break;
            }
        },

        'click .evtBtn'(event) {
            event.preventDefault();

            var selId = ($('input[name=nRunner]:checked', '.rTable').val());

            var action = event.currentTarget.dataset.target;

            if (action === "createR") {

                //create a new row with disabled save button
                createNewRow();
                // enable save button if anything is filled

                //save the record
            }
        },

        'change input[type=radio][name=nRunner]'(event) {
            event.preventDefault();

            if (prevClick) {
                //reset the previous row 
                changeInput(prevClick, false);
            }
            prevClick = event.target.value;

            changeInput(event.target.value, true)


            $("#newRecord").remove();
        },

    });
}

function htmlEscape(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function changeInput(selId, isInput) {

    var selRow = $("#" + selId);

    for (i = 1; i <= 5; i++) {
        if (isInput) {
            createInput(selRow.find("div")[i]);
        } else {
            removeInput(selRow.find("div")[i]);
        }
    }
    selRow.find(":checkbox").prop("disabled", !isInput)
    selRow.find("select").prop("disabled", !isInput)

    //additional input
    for (i = 9; i <= 10; i++) {
        if (isInput) {
            createInput(selRow.find("div")[i]);
        } else {
            removeInput(selRow.find("div")[i]);
        }
    }


    if (isInput) {
        selRow.append($("<div id=\"action\" class=\"rTableCell\"><i class=\"fa fa-save w3-xlarge w3-padding-small actBtn\" data-action=\"save\" data-rowid=" + selId + "></i><i class=\"fa fa-trash w3-xlarge w3-padding-small actBtn\" data-action=\"delete\" data-rowid=" + selId + "></i></div>"));
    } else {
        selRow.find("#action").remove();
    }
}

function removeInput(parent) {
    var txt = $(parent).find("input")[0].value
    $(parent).empty();
    $(parent).text(txt);
}


function createInput(parent) {
    var $inp = $("<input value='" + $(parent).text() + "'>");
    $(parent).text("");
    parent.append($inp[0]);
}

function saveRunner(selID) {

    var selRow = $("#" + selID);

    Runners.update(selID, {
        $set: {
            firstName: selRow.find("input")[1].value,
            lastName: selRow.find("input")[2].value,
            email: selRow.find("input")[3].value,
            team: selRow.find("input")[4].value,
            birthday: selRow.find("input")[5].value,
            gender: selRow.find("select option:selected").text(),
            //verified: $(selRow.find(":checkbox")[0])[0].checked,
            payed: $(selRow.find(":checkbox")[0])[0].checked
        },
    }, function (error, result) {
        if (error) Bert.alert(selRow.find("input")[3].value + " nicht gespeichert!", 'danger');
        if (result) {
            Bert.alert(selRow.find("input")[3].value + " gespeichert!", 'success');
            $('input[name=nRunner]').removeAttr('checked');
            prevClick = null;
            changeInput(selID, false);
        };
    });
}

function deleteRunner(selID) {

    var selRow = $("#" + selID);

    Runners.remove(selID
        , function (error, result) {
            if (error) Bert.alert(selRow.find("input")[3].value + " nicht gelöscht!", 'danger');
            if (result) {
                Bert.alert("Teilnehmer gelöscht", 'success');
            };
        });
    prevClick = null;
}


function createNewRow() {
    var newRow = $("<div class=\"rTableRow\" id=\"newRecord\"><div class=\"rTableCell rFirstCell\"><input type=\"radio\" checked=\"checked\" name=\"nRunner\" value=\"\"></div><div class=\"rTableCell\"><input value=\"\"></div><div class=\"rTableCell\"><input value=\"\"></div><div class=\"rTableCell\"><input value=\"\"></div><div class=\"rTableCell\"><input value=\"\"></div><div class=\"rTableCell\"><input value=\"\"></div><div class=\"rTableCell\"><select class=\"w3-select\" name=\"gender\"><option value=\"Mädchen\">Mädchen</option><option value=\"Junge\">Junge</option></select></div><div class=\"rTableCell\"><select class=\"w3-select\" name=\"event\"><option value=\"1\">MAD Enduro</option><option value=\"5\">MAD Enduro + MAD HALL4X</option><option value=\"3\">MAD Nachwuchs</option><option value=\"4\">MAD Crosscountry</option></select></div><div class=\"rTableCell\"><input class=\"w3-check\" type=\"checkbox\"></div><div class=\"rTableCell\"><input value=\"\"></div><div id=\"action\" class=\"rTableCell\"><i class=\"fa fa-save w3-xlarge w3-padding-small actBtn\" data-action=\"create\" data-rowid=\"\"></div></div>");
    $(".rTable").append(newRow);
}

function verifyNewInput() {
}

function createRunner() {

    var isValid = true;

    $("#newRecord").find("input")[1].value.length == 0 ? isValid = false : isValid = true;
    $("#newRecord").find("input")[2].value.length == 0 ? isValid = false : isValid = true;
    $("#newRecord").find("input")[3].value.length == 0 ? isValid = false : isValid = true;
    $("#newRecord").find("input")[5].value.length == 0 ? isValid = false : isValid = true;

    if (!isValid) {
        Bert.alert("Mussfelder ausfüllen", 'danger');
    } else {
        Runners.insert({
            firstName: htmlEscape($("#newRecord").find("input")[1].value),
            lastName: htmlEscape($("#newRecord").find("input")[2].value),
            email: htmlEscape($("#newRecord").find("input")[3].value),
            team: htmlEscape($("#newRecord").find("input")[4].value),
            gender: htmlEscape($("#newRecord").find("select[name='gender'] option:selected").text()),
            event: parseInt($("#newRecord").find("select[name='event'] option:selected").val()),
            birthday: htmlEscape($("#newRecord").find("input")[5].value),
            createdAt: new Date(),
            //verified: $("#newRecord").find(":checkbox")[0].checked,
            payed: $("#newRecord").find(":checkbox")[0].checked,
            startnumber: htmlEscape($("#newRecord").find("input")[6].value),
            token: "0"
        }, function (error, result) {
            if (error) {
                console.log(error);
                Bert.alert("Fehler beim Anlegen", 'danger');
            } //info about what went wrong
            if (result) {
                Bert.alert("Benutzer erfolgreich angelegt", 'success');
                $("#newRecord").remove();

            }
        });
    };
}