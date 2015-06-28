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
 