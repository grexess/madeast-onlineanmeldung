import './results.html';

Template.results.helpers({

    results: function () {
        var x = ReactiveMethod.call("getResults");
        return x;
    }
})
