/**
 * Created by Marcela on 29. 4. 2015.
 */

///<reference path="../typing/jquery.d.ts" />
///<reference path="../typing/moment.d.ts" />
///<reference path="common.ts" />
///<reference path="helpers.ts" />


    /*
    * moment.locale("cs-cz")
    *
    * moment.months()
    * ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"]
    * ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
    * ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"]
    *
    * moment.weekdaysMin()
    * ["ne", "po", "út", "st", "čt", "pá", "so"]
    * ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"]
    * ["вс", "пн", "вт", "ср", "чт", "пт", "сб"]
    * */

module Calendar {

    /**
     * Provides rendering month calendars, marks specified events by
     * custom colors, displays tooltip for each event both personal and
     * to other users. Sets Monday as the first day of week.
     *
     * @class MonthCalendar
     * @constructor
     * @param {ISettings} settings - Plugin settings
     * @param {number} year - Actual year of calendar
     * @property {JQuery} element - Month calendars DOM element
     * @property {ISettings} settings - Plugin settings
     * @property {number} year - Actual year of calendar
     * @property {Date} today - Javascript Date object
     * @property {Array<string>} months - Array of month names
     * @property {Array<string>} weekdays - Array of weekdays shortcuts
     */
    export class MonthCalendar {
        element: JQuery;
        settings: ISettings;
        year: number;
        today: Date = new Date();
        months: Array<string>;
        weekdays: Array<string>;

        constructor(settings: ISettings, year: number) {
            this.settings = settings;
            this.year = year;
            this.months = moment.months();
            this.weekdays = moment.weekdaysShort();
            // set Monday as first day of week
            var sunday = this.weekdays[0];
            this.weekdays.shift();
            this.weekdays.push(sunday);
            // capitalize first letter
            this.capitalize();

            this.element = this.templateCalendar();
        }

        /**
         * Capitalizes the first letter of the month and weekdays names.
         *
         * @method capitalize
         */
        capitalize(): void {
            this.months = this.months.map(item => Calendar.Helpers.CapitalizeFirstLetter(item));
            this.weekdays = this.weekdays.map(item => Calendar.Helpers.CapitalizeFirstLetter(item));
        }

        /**
         * Creates wrapper for month tables.
         *
         * @method templateCalendar
         * @return {JQuery}
         */
        templateCalendar(): JQuery {
            var view = $("<div />").addClass("row");
            for(var i = 0, length = this.months.length; i < length; i++) {
                var monthElement = $("<div />").addClass("col-md-3 col-sm-4");
                monthElement
                    .append(this.templateTable(i))
                    .appendTo(view);
            }
            return view;
        }

        /**
         * Creates table for month represented by month index,
         * marks weekdays and events.
         *
         * @method templateTable
         * @param {number} monthId - Month index 0 - 11
         * @return {JQuery}
         */
        templateTable(monthId: number): JQuery {
            var actualDate = new Date(this.year, monthId), // first day in month
                weekDay = (actualDate.getDay() + 6) % 7,    // Monday is start of week
                daysInMonth = moment(actualDate).daysInMonth(), // number of days in month
                displayDay = daysInMonth == 0;              // set display first day in calendar if it is Monday

            // table
            var table = $("<table />")
                .addClass("calendar-table table-bordered")
                .append($("<thead />")
                    .append($("<tr />")
                        .addClass("calendar-header-month")
                        .append($("<th />")
                            .attr("colSpan", 7)
                            .text(this.months[monthId])))
                    .append($("<tr />")
                        .addClass("calendar-header-day")))
                .append($("<tbody />")
                    .addClass("calendar-body"));

            // header
            var dayRow = table.find(".calendar-header-day");
            this.weekdays.forEach((item) => dayRow.append($("<th />").text(item)));

            // body
            var calendarBody = table.find(".calendar-body");
            var index = 1;
            for(var i = 0; i < 6; i++) {
                var row = $("<tr />");
                for(var j = 0; j < 7; j++) {
                    var cell = $("<td />").addClass("cell");
                    if(i === 0 && j >= weekDay) {
                        displayDay = true;
                    }

                    if(displayDay) {
                        var cellDate = new Date(this.year, monthId, index),
                            cellDateIndex = cellDate.getDay();
                        // set weekend
                        if(cellDateIndex === 6 || cellDateIndex === 0) {
                            cell.addClass("weekend");
                        }
                        // set today
                        if(moment(cellDate).format("YYYY-MM-DD") === moment(this.today).format("YYYY-MM-DD")) {
                            cell.addClass("css-today").addClass("today");
                        }

                        // set vacation
                        // TODO ============

                        // set date number
                        cell.attr("data-year-day", moment(cellDate).dayOfYear()).text(index);
                        // resolve month index
                        if (index < daysInMonth) {
                            index++;
                        } else {
                            index = 1;
                            displayDay = false;
                        }
                    }
                    row.append(cell);
                }
                calendarBody.append(row);
            }
            return table;
        }
    }
}