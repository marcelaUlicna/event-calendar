///<reference path="../typing/jquery.d.ts" />
///<reference path="../typing/moment.d.ts" />
///<reference path="common.ts" />
///<reference path="helpers.ts" />
var Calendar;
(function (Calendar) {
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
    var MonthCalendar = (function () {
        function MonthCalendar(settings, year) {
            /**
             * Javascript Date object represents current date.
             *
             * @property today
             * @type {Date}
             */
            this.today = new Date();
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
        MonthCalendar.prototype.capitalize = function () {
            this.months = this.months.map(function (item) { return Calendar.Helpers.CapitalizeFirstLetter(item); });
            this.weekdays = this.weekdays.map(function (item) { return Calendar.Helpers.CapitalizeFirstLetter(item); });
        };
        /**
         * Creates wrapper for month tables.
         *
         * @method templateCalendar
         * @return {JQuery} - Calendar for each month
         */
        MonthCalendar.prototype.templateCalendar = function () {
            var view = $("<div />").addClass("row");
            for (var i = 0, length = this.months.length; i < length; i++) {
                var monthElement = $("<div />").addClass("col-md-3 col-sm-4");
                monthElement.append(this.templateTable(i)).appendTo(view);
            }
            return view;
        };
        /**
         * Creates table for month represented by month index,
         * marks weekdays and events.
         *
         * @method templateTable
         * @param {number} monthId - Month index 0 - 11
         * @return {JQuery} - Month calendar
         */
        MonthCalendar.prototype.templateTable = function (monthId) {
            var actualDate = new Date(this.year, monthId), weekDay = (actualDate.getDay() + 6) % 7, daysInMonth = moment(actualDate).daysInMonth(), displayDay = daysInMonth == 0; // set display first day in calendar if it is Monday
            // table
            var table = $("<table />").addClass("calendar-table table-bordered").append($("<thead />").append($("<tr />").addClass("calendar-header-month").append($("<th />").attr("colSpan", 7).text(this.months[monthId]))).append($("<tr />").addClass("calendar-header-day"))).append($("<tbody />").addClass("calendar-body"));
            // header
            var dayRow = table.find(".calendar-header-day");
            this.weekdays.forEach(function (item) { return dayRow.append($("<th />").text(item)); });
            // body
            var calendarBody = table.find(".calendar-body");
            var index = 1;
            for (var i = 0; i < 6; i++) {
                var row = $("<tr />");
                for (var j = 0; j < 7; j++) {
                    var cell = $("<td />").addClass("cell");
                    if (i === 0 && j >= weekDay) {
                        displayDay = true;
                    }
                    if (displayDay) {
                        var cellDate = new Date(this.year, monthId, index), cellDateIndex = cellDate.getDay();
                        // set weekend
                        if (cellDateIndex === 6 || cellDateIndex === 0) {
                            cell.addClass("weekend");
                        }
                        // set today
                        if (moment(cellDate).format("YYYY-MM-DD") === moment(this.today).format("YYYY-MM-DD")) {
                            cell.addClass("css-today").addClass("today");
                        }
                        // set date number
                        cell.attr("data-year-day", moment(cellDate).dayOfYear()).text(index);
                        // resolve month index
                        if (index < daysInMonth) {
                            index++;
                        }
                        else {
                            index = 1;
                            displayDay = false;
                        }
                    }
                    row.append(cell);
                }
                calendarBody.append(row);
            }
            return table;
        };
        return MonthCalendar;
    })();
    Calendar.MonthCalendar = MonthCalendar;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=months.js.map