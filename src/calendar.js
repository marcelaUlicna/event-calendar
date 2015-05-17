///<reference path="../typing/jquery.d.ts" />
///<reference path="common.ts" />
///<reference path="header.ts" />
///<reference path="months.ts" />
///<reference path="events.ts" />
///<reference path="actions.ts" />
/**
 * Event calendar plugin.
 *
 * @module Calendar
 */
var Calendar;
(function (Calendar) {
    /**
     * Provides the base plugin class and initializes all components.
     *
     * @class EventCalendar
     * @constructor
     * @param {JQuery} element - DOM element for plugin
     * @param {ISettings} options - Custom options
     */
    var EventCalendar = (function () {
        function EventCalendar(element, options) {
            var _this = this;
            this.element = element;
            this.year = new Date().getFullYear();
            this.settings = $.extend(true, this.defaultSettings(), options);
            if (this.settings.locale) {
                moment.locale(this.settings.locale);
            }
            this.moveAction = new this.settings.moveAction();
            this.events = new Calendar.Events(this.element, this.settings);
            this.events.setSelectedlYear(this.year);
            this.element.on("click", ".year-direction", function (e) { return _this.changeYear(e); });
        }
        /**
         * Initializes default plugin settings.
         *
         * @method defaultSettings
         * @return {ISettings} - Default settings
         */
        EventCalendar.prototype.defaultSettings = function () {
            return {
                events: [{ name: "Default" }],
                editable: true,
                localization: {
                    messageSentence: "Information (users will see this message)",
                    noteSentence: "Notes (only you will see this message)",
                    submitButton: "Submit",
                    deleteButton: "Delete"
                },
                moveAction: Calendar.MoveAction
            };
        };
        /**
         * Calls static method to mark cells with server data.
         *
         * @method setEventFormat
         */
        EventCalendar.prototype.setEventFormat = function () {
            if (this.settings.data) {
                Calendar.Events.dataEventFormat(this.settings.data, this.settings.events, this.year);
            }
        };
        /**
         * Initializes view with calendars.
         *
         * @method init
         */
        EventCalendar.prototype.init = function () {
            //console.log(this.settings);
            this.element.empty();
            var header = new Calendar.Header(this.year), monthTables = new Calendar.MonthCalendar(this.settings, this.year);
            var wrapper = $("<div />").addClass("calendar-wrapper").append(header.element).append(monthTables.element);
            wrapper.appendTo(this.element);
            this.setEventFormat();
        };
        /**
         * Changes the year of calendar and calls method
         * which obtains new data for selected year.
         *
         * @method changeYear
         * @param {JQueryEventObject} e - Button object handler
         */
        EventCalendar.prototype.changeYear = function (e) {
            var _this = this;
            var direction = $(e.target).closest(".year-direction").attr("data-direction");
            if (direction === "prev") {
                this.year = this.year - 1;
                this.moveAction.previous(this.year, this.settings.data).always(function () { return _this.setSelectedYear(); });
            }
            else {
                this.year = this.year + 1;
                this.moveAction.next(this.year, this.settings.data).always(function () { return _this.setSelectedYear(); });
            }
        };
        /**
         * Sets data for selected year and calls rerendering calendar view
         * and invokes method to mark cells according to server data.
         *
         * @method setSelectedYear
         */
        EventCalendar.prototype.setSelectedYear = function () {
            this.settings.data = this.moveAction.data;
            this.init();
            this.events.setSelectedlYear(this.year);
            this.setEventFormat();
        };
        return EventCalendar;
    })();
    Calendar.EventCalendar = EventCalendar;
})(Calendar || (Calendar = {}));
(function ($) {
    $.fn.vacationCalendar = function () {
        var option = arguments[0], args = arguments;
        return this.each(function () {
            var $this = $(this), data = $this.data("jquery.vacation.calendar"), options = $.extend({}, $.fn.vacationCalendar.defaults, $this.data(), typeof option === 'object' && option);
            if (!data) {
                $this.data("jquery.vacation.calendar", (data = new Calendar.EventCalendar($this, options)));
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