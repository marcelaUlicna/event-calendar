/* global Calendar */
/* global $ */

$(function(){
   var events = [];

    // get data from server
    $.ajax("data/events.json")
        .done(function(result) {
            events = result;
        })
        .always(function(){
            calendar();
        });

    function calendar () {
        $("#calendar").vacationCalendar({
            data: events,
            events: [
                {name: "Vacation", backgroundColor: "#5CB85C"},
                {name: "Available", backgroundColor: "#5BC0DE"},
                {name: "Business trip", backgroundColor: "#EC971F"},
                {name: "Unavailable", backgroundColor: "#D9534F"},
                {name: "Other"}
            ],
            locale: "cs",
            localization: {
                messageSentence: "Informace (uživatel uvidí tuto zprávu)",
                noteSentence: "Poznámka (pouze pro vás)",
                submitButton: "Odeslat",
                deleteButton: "Vymazat"
            },
            moveAction: Calendar.MyMoveAction
        });

    }
});
 