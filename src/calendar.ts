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
module Calendar {

    /**
     * Provides the base plugin class and initializes all components.
     *
     * @class EventCalendar
     * @constructor
     * @param {JQuery} element - DOM element for plugin
     * @param {ISettings} options - Custom options
     */
    export class EventCalendar {
        /**
        * jQuery element.
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
         * Calendar events.
         *
         * @property events
         * @type {Events}
         */
        events: Events;

        /**
         * Actual year.
         *
         * @property year
         * @type {number}
         */
        year: number;

        /**
         * Actions to render caledar for next or previous year.
         *
         * @property moveAction
         * @type {any}
         */
        moveAction: any;

        constructor(element: JQuery, options: ISettings) {
            this.element = element;
            this.year = new Date().getFullYear();

            this.settings = $.extend(true, this.defaultSettings(), options);

            if(this.settings.locale) {
                moment.locale(this.settings.locale);
            }

            this.moveAction = this.settings.moveAction;
            this.events = new Events(this.element, this.settings);
            this.events.setSelectedlYear(this.year);

            this.element.on("click", ".year-direction", e => this.changeYear(e));
        }

        /**
         * Initializes default plugin settings.
         *
         * @method defaultSettings
         * @return {ISettings} - Default settings
         */
        defaultSettings(): ISettings {
            return {
                events:  [{ name: "Default" }],
                editable: true,
                localization: {
                    messageSentence: "Information (users will see this message)",
                    noteSentence: "Notes (only you will see this message)",
                    submitButton: "Submit",
                    deleteButton: "Delete"
                },
                moveAction: new MoveAction(),
                submitData: new PostDataAction(),
                deleteData: new PostDataAction()
            }
        }

        /**
         * Calls static method to mark cells with server data.
         *
         * @method setEventFormat
         */
        setEventFormat(): void {
            if(this.settings.data) {
                Calendar.Events.dataEventFormat(this.settings.data, this.settings.events, this.year);
            }
        }

        /**
         * Initializes view with calendars.
         *
         * @method init
         */
        init(): void {
            this.element.empty();
            var header = new Header(this.year),
                monthTables = new MonthCalendar(this.settings, this.year);

            var wrapper =
                $("<div />")
                    .addClass("calendar-wrapper")
                    .append(header.element)
                    .append(monthTables.element);

            wrapper.appendTo(this.element);

            this.setEventFormat();
        }

        /**
         * Destroys plugin and removes all event handlers.
         *
         * __Usage__:
         *
         *     $("#calendar").vacationCalendar.destroy();
         *
         * @method destroy
         */
        destroy(): void {
            this.element.removeData("jquery.vacation.calendar");
            this.element.off();
            this.element.unbind();
            this.element.empty();
        }

        /**
         * Changes the year of calendar and calls method
         * which obtains new data for selected year.
         *
         * @method changeYear
         * @param {JQueryEventObject} e - Button object handler
         */
        changeYear(e: JQueryEventObject): void {
            var direction = $(e.target).closest(".year-direction").attr("data-direction");
            this.year = direction === "prev" ? this.year - 1 : this.year + 1;
                
            if(this.moveAction.move) {
                this.moveAction
                    .move(this.year, this.settings.data)
                    .always(() => this.setSelectedYear());
            } else {
                this.moveAction.call(null, this.year);
            }
        }

        /**
         * Sets data for selected year and calls rerendering calendar view
         * and invokes method to mark cells according to server data.
         *
         * @method setSelectedYear
         */
        setSelectedYear(): void {
            this.settings.data = this.moveAction.data;
            this.init();
            this.events.setSelectedlYear(this.year);
            this.setEventFormat();
        }
    }
}

(function($){
    $.fn.eventCalendar = function(){
        var option = arguments[0],
            args = arguments;

        return this.each(function(){
            var $this = $(this),
                data = $this.data("jquery.event.calendar"),
                options = $.extend({}, $.fn.eventCalendar.defaults, $this.data(), typeof option === 'object' && option);

            if(!data) {
                $this.data("jquery.event.calendar", (data = new Calendar.EventCalendar($this, options)));
            }

            if (typeof option === 'string') {
                data[option](args[1]);
            } else {
                data.init();
            }

            $.fn.eventCalendar.destroy = function(){
                data.destroy();
            };
        });
    };


    $.fn.eventCalendar.defaults = { };
})(jQuery);