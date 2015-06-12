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
        $("#calendar").eventCalendar({
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
            }
        });

    }
});

/**
 * Change year
 * ===========
 * 1. not specified - only client side functionality, renders caledar view for actual year
 * 2. typescript
 *    - own class extends MoveAction
 *    - implement move(year: number, data?: Array<IData>): JQueryPromise<any>
 *    - moveAction: new Calendar.MyMoveAction()
 * 3. javascript
 *    - moveAction: function(param) {}
 *    - param contains new year
 * 
 * Submit and delete request
 * =========================
 * 1. not specified - only client side functionality
 * 2. typescript
 *    - own class extends PostDataAction
 *    - implement process(data: Array<IData>): void
 *    - submitData: new Calendar.MySubmitMethod()
 *    - deleteData: new Calendar.MyDeleteMethod()
 * 3. javascript
 *    - submitData: function (params) {}
 *    - deleteData: function (params) {}
 *    - params contains object array
 *    - object has following properties:
 *      - date: Date
 *      - event: string
 *      - message: string
 *      - note: string;
 */
 