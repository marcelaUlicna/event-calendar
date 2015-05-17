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
module Calendar {

    /**
     * Provides the base plugin class and initializes all components.
     *
     * @class EventCalendar
     * @constructor
     * @param {JQuery} element - DOM element for plugin
     * @param {ISettings} options - Custom options
     * @property {JQuery} element - DOM element for plugin
     * @property {ISettings} settings - Default settings
     * @property {CalendarEvents} events - Calendar events
     * @property {number} year - Actual year of calendar
     */
    export class EventCalendar {
        element: JQuery;
        settings: ISettings = {
            events:  [{ name: "Default" }],
            editable: true
        };
        events: Events;
        year: number;

        constructor(element: JQuery, options: ISettings) {
            this.element = element;
            this.year = new Date().getFullYear();

            this.settings = $.extend(true, this.settings, options);

            if(this.settings.locale) {
                moment.locale(this.settings.locale);
            }

            this.events = new Events(this.element, this.settings);
            this.events.setSelectedlYear(this.year);

            this.element.on("click", ".year-direction", e => this.changeYear(e));
        }

        /**
         * Initializes view with calendars.
         *
         * @method init
         */
        init(): void {
            //console.log(this.settings);
            this.element.empty();
            var header = new Header(this.year),
                monthTables = new MonthCalendar(this.settings, this.year);

            var wrapper =
                $("<div />")
                    .addClass("calendar-wrapper")
                    .append(header.element)
                    .append(monthTables.element);

            wrapper.appendTo(this.element);
        }

        /**
         * Changes the year of calendar and calls rerendering calendar view
         *
         * @method changeYear
         * @param {JQueryEventObject} e - Button object handler
         */
        changeYear(e: JQueryEventObject): void {
            var direction = $(e.target).closest(".year-direction").attr("data-direction");
            this.year = direction === "prev" ? this.year - 1 : this.year + 1;
            this.init();
            this.events.setSelectedlYear(this.year);
        }
    }
}

(function($){
    $.fn.vacationCalendar = function(){
        var option = arguments[0],
            args = arguments;

        return this.each(function(){
            var $this = $(this),
                data = $this.data("jquery.vacation.calendar"),
                options = $.extend({}, $.fn.vacationCalendar.defaults, $this.data(), typeof option === 'object' && option);

            if(!data) {
                $this.data("jquery.vacation.calendar", (data = new Calendar.EventCalendar($this, options)));
            }

            if (typeof option === 'string') {
                data[option](args[1]);
            } else {
                data.init();
            }
        });
    };

    $.fn.vacationCalendar.defaults = {

    };
})(jQuery);