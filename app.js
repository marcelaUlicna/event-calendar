/* global moment */
/* global $ */

$(function(){

	var configSelector = "calendarTab";
	var modalConfig = $(".modalConfig");
	
	moment.locale("en");

	$('#myTab a').click(function (e) {
		  e.preventDefault();
		  var tab = $(this).attr("aria-controls");
		  $("#eventCalendar").eventCalendar.destroy();
		  $(".calendarNote").show();
		  
		  switch(tab) {
			case "calendar":
				configSelector = "calendarTab";
				CalendarScr();
				break;
			case "advance":
				configSelector = "advanceTab";
				AdvanceCalendar();
				break;
			case "localization":
				configSelector = "localizationTab";
				LocalizedCalendar();
				break;
			case "documentation":
				$(".calendarNote").hide();
				Documentation();
				break;
			default:
				break;
		  }
		});
		
	$('#config').click(function(){
		modalConfig.find('.modal-body').find('.modalCode').hide();
		modalConfig.find($("#" + configSelector)).show();
		modalConfig.modal();
	});

	function CalendarScr () {
		moment.locale("en");
		$("#eventCalendar").eventCalendar();
	}

    function AdvanceCalendar () {
        moment.locale("en");
		$("#eventCalendar").eventCalendar({
            events: [
                {name: "Vacation", backgroundColor: "#5CB85C"},
                {name: "Available", backgroundColor: "#5BC0DE"},
                {name: "Business trip", backgroundColor: "#EC971F"},
                {name: "Unavailable", backgroundColor: "#D9534F"},
                {name: "Other event"}
            ]
        });
    }
	
	function LocalizedCalendar () {
		$("#eventCalendar").eventCalendar({
            events: [
                {name: "Dovolená", backgroundColor: "#5CB85C"},
                {name: "Dostupný", backgroundColor: "#5BC0DE"},
                {name: "Pracovní schůzka", backgroundColor: "#EC971F"},
                {name: "Zaneprázdněný", backgroundColor: "#D9534F"},
                {name: "Jiná událost"}
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
	
	function Documentation () {
		$("#eventCalendar").text("See documentation in new tab");
		
		window.open(
		  'doc/index.html',
		  '_blank'
		);
	}
	
	CalendarScr();
});
 