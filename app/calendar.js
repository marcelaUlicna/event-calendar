/**
 * Created by Marcela on 28. 4. 2015.
 */
///<reference path="../typing/jquery.d.ts" />
///<reference path="common.ts" />
///<reference path="header.ts" />
///<reference path="months.ts" />
///<reference path="events.ts" />
/**
 * Vacation calendar plugin.
 *
 * @module Calendar
 */
var Calendar;
(function (Calendar) {
    /**
     * Provides the base plugin class and initializes all components.
     *
     * @class VacationCalendar
     * @constructor
     * @param {JQuery} element - DOM element for plugin
     * @param {ISettings} options - Custom options
     * @property {JQuery} element - DOM element for plugin
     * @property {ISettings} settings - Default settings
     * @property {CalendarEvents} events - Calendar events
     * @property {number} year - Actual year of calendar
     */
    var VacationCalendar = (function () {
        function VacationCalendar(element, options) {
            var _this = this;
            this.settings = {
                events: [{ name: "Default" }],
                editable: true
            };
            this.element = element;
            this.year = new Date().getFullYear();
            this.settings = $.extend(true, this.settings, options);
            if (this.settings.locale) {
                moment.locale(this.settings.locale);
            }
            this.events = new Calendar.CalendarEvents(this.element, this.settings);
            this.events.setSelectedlYear(this.year);
            this.element.on("click", ".year-direction", function (e) { return _this.changeYear(e); });
        }
        /**
         * Initializes view with calendars.
         *
         * @method init
         */
        VacationCalendar.prototype.init = function () {
            //console.log(this.settings);
            this.element.empty();
            var header = new Calendar.Header(this.year), monthTables = new Calendar.MonthCalendar(this.settings, this.year);
            var wrapper = $("<div />").addClass("calendar-wrapper").append(header.element).append(monthTables.element);
            wrapper.appendTo(this.element);
        };
        /**
         * Changes the year of calendar and calls rerendering calendar view
         *
         * @method changeYear
         * @param {JQueryEventObject} e - Button object handler
         */
        VacationCalendar.prototype.changeYear = function (e) {
            var direction = $(e.target).closest(".year-direction").attr("data-direction");
            this.year = direction === "prev" ? this.year - 1 : this.year + 1;
            this.init();
            this.events.setSelectedlYear(this.year);
        };
        return VacationCalendar;
    })();
    Calendar.VacationCalendar = VacationCalendar;
})(Calendar || (Calendar = {}));
(function ($) {
    $.fn.vacationCalendar = function () {
        var option = arguments[0], args = arguments;
        return this.each(function () {
            var $this = $(this), data = $this.data("jquery.vacation.calendar"), options = $.extend({}, $.fn.vacationCalendar.defaults, $this.data(), typeof option === 'object' && option);
            if (!data) {
                $this.data("jquery.vacation.calendar", (data = new Calendar.VacationCalendar($this, options)));
            }
            if (typeof option === 'string') {
                data[option](args[1]);
            }
            else {
                data.init();
            }
        });
    };
    $.fn.vacationCalendar.defaults = {};
})(jQuery);
//# sourceMappingURL=calendar.js.map