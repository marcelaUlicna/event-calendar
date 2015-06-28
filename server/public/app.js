/* global Calendar */
/* global $ */

$(function () {
    var events = [];
    var today = new Date();

    //get data from server
    $.ajax("/api/events/" + today.getFullYear())
        .done(function (result) {
        events = result;
    })
        .always(function () {
        calendar();
    });

    function calendar() {
        $("#calendar").eventCalendar({
            data: events,
            events: [
                { name: "Dovolená", backgroundColor: "#5CB85C" },
                { name: "K dispozici", backgroundColor: "#5BC0DE" },
                { name: "Služební cesta", backgroundColor: "#EC971F" },
                { name: "Nedostupny", backgroundColor: "#D9534F" },
                { name: "Jiná událost" }
            ],
            locale: "cs",
            localization: {
                messageSentence: "Informace (uživatel uvidí tuto zprávu)",
                noteSentence: "Poznámka (pouze pro vás)",
                submitButton: "Odeslat",
                deleteButton: "Vymazat"
            },
            moveAction: function (params) {
                var url = "/api/events/" + params;
                return $.ajax(url)
                    .done(function (result) {
                    return result;
                })
                    .fail(function () {
                    return null;
                });
            },
            submitData: function (params) {
                if (params != null) {
                    $.ajax({
                        url: "/api/events",
                        method: "POST",
                        data: { dataEvents: params },
                        dataType: "json",
                        success: function (result) {
                            console.log(result);
                        },
                        failed: function (error) {
                            console.log(error);
                        }
                    });
                }
            },
            deleteData: function (params) {
                if (params != null) {
                    $.ajax({
                        url: "/api/events",
                        method: "DELETE",
                        data: { dataEvents: params },
                        dataType: "json",
                        success: function (result) {
                            console.log(result);
                        },
                        failed: function (error) {
                            console.log(error);
                        }
                    });
                }
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
 * Example:
 * moveAction: function (params) {
 *      var url = "data/events" + params + ".json";
 *      return $.ajax(url)
 *          .done(function(result) {
 *              return result;
 *          })
 *          .fail(function() {
 *              return null;
 *          });
 * }
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
 