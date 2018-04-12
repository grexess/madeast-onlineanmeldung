import './runnersList.html';

import {
    Runners
} from '../../../api/runners.js';

if (Meteor.isClient) {

    Template.runnersListTemplate.helpers({
        runners() {
            return Runners.find({});
        }
    });

    Template.registerHelper('formatBoolean', function (value) {
        return value.toString();
    });

    Template.runnersListTemplate.events({

        'click .evtBtn' (event) {
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

            if (action === "changeR") {
                if (selId) {
                    //$('#overlay').show();
                    changeToInput(selId);
                    //set the values
                    var record = Runners.find({
                        "_id": selId
                    }).fetch()[0];
                    $('#firstName').val(record.firstName);
                    $('#lastName').val(record.lastName);
                    $('#club').val(record.club);



                    $('#addRunnerForm')[0].reset();
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

function changeToInput(selId){
    selRow= $("#"+ selId);

    var elem = selRow.find("div")[1];
    var txt = $(elem).text();
    $(elem).text("");

    var $inp = $( "<input value='"+ "Hallo" +"'>" );

    elem.append($inp);

}