///<reference path="../typing/jquery.d.ts" />
///<reference path="../typing/moment.d.ts" />
///<reference path="common.ts" />
///<reference path="helpers.ts" />

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
     */
    export class MonthCalendar {
        /**
         * Month calendars DOM element.
         *
         * @property element
         * @type {JQuery}
         */
        element: JQuery;

        /**
         * Plugin settings.
         *
         * @property settings
         * @type {ISettings}
         */
        settings: ISettings;

        /**
         * Selected year.
         *
         * @property year
         * @type {number}
         */
        year: number;

        /**
         * Javascript Date object represents current date.
         *
         * @property today
         * @type {Date}
         */
        today: Date = new Date();

        /**
         * Array of month names.
         *
         *     ["January", "February", "March", "April", "May",
         *     "June", "July", "August", "September",
         *     "October", "November", "December"]
         *
         * @property months
         * @type {Array<string>}
         */
        months: Array<string>;

        /**
         * Array of weekdays shortcuts.
         *
         *     ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
         *
         * @property weekdays
         * @type {Array<string>}
         */
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
         * @return {JQuery} - Calendar for each month
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
         * @return {JQuery} - Month calendar
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

                        // set date number
                        cell.attr("data-year-day", moment(cellDate).dayOfYear());
                        
                        // set today classes or text for other days
                        if(moment(cellDate).format("YYYY-MM-DD") === moment(this.today).format("YYYY-MM-DD")) {
                            cell.addClass("css-today");
                            cell.append($("<span class='today'>" + index + "</span>"));
                        } else {
                            cell.text(index);
                        }
                        
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