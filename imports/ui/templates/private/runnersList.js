import './runnersList.html';

import {
    Runners
} from '../../../api/runners.js';

prevClick = null;

if (Meteor.isClient) {

    Template.runnersListTemplate.helpers({
        runners() {
            return Runners.find({});
        }
    });

    Template.registerHelper('formatBoolean', function (value) {

        if (value) {
            return "checked";
        } else { return ""; }
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
                default:
                    break;
            }


        },

        'click .evtBtn'(event) {
            event.preventDefault();

            var selId = ($('input[name=nRunner]:checked', '.rTable').val());

            var action = event.currentTarget.dataset.target;

            if (action === "deleteR") {
                if (selId) {
                    Runners.remove(selId, function (error, result) {
                        if (error) console.log(error); //info about what went wrong
                        if (result) console.log(result); //the _id of new object if successful);
                    });
                    Bert.alert("Runner removed", 'info');
                } else {
                    Bert.alert("No Runner selected", 'danger');
                }
            }


            if (action === "createR") {
                $('#overlay').show();
            }

            if (action === "createUser") {

                //const gender = Meteor.call('htmlEscape',{str: $('input[name="gender"]:checked').val()}());
                //const birthday = Meteor.call('htmlEscape',{str: $('#dob-day :selected').val() + "." + instance.$('#dob-month :selected').val() + "." + instance.$('#dob-year :selected').val());
                //const group = Meteor.call('htmlEscape',{str:(calculateGroup(instance.$('#dob-day :selected').val(), instance.$('#dob-month :selected').val(), instance.$('#dob-year :selected').val(), gender));

                Runners.insert({
                    firstName: htmlEscape($('#firstName').val()),
                    lastName: htmlEscape($('#lastName').val()),
                    club: htmlEscape($('#club').val()),
                    //	gender: gender,
                    //	birthday: birthday,
                    //	group: group,
                    createdAt: new Date()
                });

                $('#overlay').hide();
                $('#addRunnerForm')[0].reset();
                Bert.alert("Runner created", 'info');
            }

            if (action === "cancelCreation") {
                $('#overlay').hide();
                Bert.alert("Action canceled", 'info');
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
        }

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
            verified: $(selRow.find(":checkbox")[0])[0].checked,
            payed: $(selRow.find(":checkbox")[1])[0].checked
        },
    }, function (error, result) {
        if (error) Bert.alert(selRow.find("input")[3].value + " nicht gespeichert!", 'danger');
        if (result) {
            Bert.alert(selRow.find("input")[3].value + " gespeichert!", 'success');
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
}