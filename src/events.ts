///<reference path="../typing/jquery.d.ts" />
///<reference path="../typing/moment.d.ts" />
///<reference path="common.ts" />
///<reference path="helpers.ts" />
///<reference path="modal.ts" />
///<reference path="popover.ts" />

module Calendar {

    /**
     * Implements mouse event handlers and provides selected range
     * of days indexes and sets selected class. Show modal dialog with
     * custom setting when user can select one event and type message
     * for other person and/or note to himself. After receiving response from
     * modal dialog there is made design changes in calendar and calls
     * method which provides custom server side request.
     *
     * @class Events
     * @constructor
     * @param {JQuery} element - Calendar jquery element
     * @param {ISettings} settings - Plugin settings
     */
    export class Events {
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
         * Object with start and end index. Indexes represents the number of day in year.
         *
         * @property indexes
         * @type {IArrayIndexes}
         */
        indexes: IArrayIndexes;

        /**
         * Selected year.
         *
         * @property year
         * @type {number}
         */
        year: number;

        /**
         * Modal dialog settings.
         *
         * @property dialogSettings
         * @type {IModalDialog}
         */
        dialogSettings: IModalDialog = {
            start: null,
            end: null,
            events: [],
            selectedEvent: "",
            defaultBgColor: "#5CB85C",
            defaultColor: "white",
            localization: null
        };

        constructor(element: JQuery, settings: ISettings) {
            this.element = element;
            this.settings = settings;
            this.dialogSettings.localization = this.settings.localization;
            this.dialogSettings.events = this.settings.events;
            this.dialogSettings.selectedEvent = this.settings.events[0].name;
            this.resetIndexes();

            if(this.settings.editable) {
                this.element.on("mouseup mouseover mousedown", "td.cell", (e) => {
                    this[e.type](e);
                });
            }
        }

        /**
         * Sets selected year to local variable.
         *
         * @method setSelectedlYear
         * @param {number} year - Selected year
         */
        setSelectedlYear(year: number): void {
            this.year = year;
        }

        /**
         * Implements mousedown event. Sets start index and adds selected class to actual cell.
         *
         * @method mousedown
         * @param {JQueryEventObject} e - Event handler object
         */
        mousedown(e: JQueryEventObject): void {
            if(!this.leftMousePressed(e)) return;

            e.preventDefault();
            var cellElement = $(e.target).closest('td'),
                index = cellElement.attr('data-year-day');

            if(!index) return;

            $('td.cell').removeClass('selected-day');
            this.indexes = {start: Number(index), end: Number(index)};
            cellElement.addClass('selected-day');
        }

        /**
         * Implements mouseover event. Sets end index, calculates range of selected cells
         * and adds selected class to all cells according to calculated range.
         *
         * @method mouseover
         * @param {JQueryEventObject} e - Event handler object
         */
        mouseover(e: JQueryEventObject): void {
            e.preventDefault();

            if(!this.indexes.start) return;

            var cellElement = $(e.target).closest('td'),
                index = cellElement.attr('data-year-day');

            if(isNaN(Number(index))) return;

            this.indexes.end = Number(index);
            if(this.indexes.start !== this.indexes.end) {
                $('td.cell').removeClass('selected-day');
                var idx = Calendar.Helpers.ArrayIndexes(this.indexes),
                    selectedRange = Calendar.Helpers.ArrayRange(idx.start, idx.end);

                selectedRange.forEach((item) => {
                    var selector = 'td.cell[data-year-day=' + item + ']';
                    $(selector).addClass('selected-day');
                });
            }
        }

        /**
         * Implements mouseup event. Sets end index, calculates start and end dates
         * from indexes and calls modal dialog to enter personal event. At the end resets start and end indexes.
         *
         * @method mouseup
         * @param {JQueryEventObject} e - Event handler object
         */
        mouseup(e: JQueryEventObject): void {
            e.preventDefault();

            if(!this.indexes.start || !this.indexes.end) return;

            var idx = Calendar.Helpers.ArrayIndexes(this.indexes);
            this.dialogSettings.start = moment([this.year]).dayOfYear(idx.start);
            this.dialogSettings.end = moment([this.year]).dayOfYear(idx.end);

            this.showModal();
        }

        /**
         * Displays modal dialog with settings and action and handlers events "Submit" or "Delete"
         * based on clicked button. After that calls removing selection styling.
         *
         * @method showModal
         */
        showModal(): void {
            var modal = new Dialog(this.dialogSettings);
            modal.show().then((result) => {
                if(result === DialogResult.Submit) {
                    this.dialogSettings = modal.dialogSettings;
                    this.submitChanges();
                } else if (result === DialogResult.Delete) {
                    this.deleteItems();
                }

                this.removeSelection();
            });
        }

        /**
         * Removes class `selected-day` used for marking selection and calls `resetIndexes()`.
         *
         * @method removeSelection
         *
         */
        removeSelection(): void {
            this.element.find("td").removeClass("selected-day");
            this.resetIndexes();
            this.dialogSettings.personalNote = null;
            this.dialogSettings.message = null;
            this.dialogSettings.selectedEvent = this.settings.events[0].name;
        }

        /**
         * Submit action. Applies css style for selected event on client side.
         * Calls `TODO: Submit server implementation` for server side implementation.
         *
         * @method submitChanges
         */
        submitChanges(): void {
            // user implementation
            this.applyEventFormat();
        }

        /**
         * Delete action. Remove css style on client side.
         * Calls `TODO: Delete server implementation` for server side implementation.
         *
         * @method deleteItems
         */
        deleteItems(): void {
            // user implementation
            this.removeEventFormat();

        }

        /**
         * Sets css styling to each cell in range of selected indexes according to
         * selected event and its properties (background color, color), sets title
         * if any of messages is typed. Adds class `event-day` to each cell and initializes
         * popover with messages.
         *
         * @method applyEventFormat
         */
        applyEventFormat(): void {
            this.indexes = Calendar.Helpers.ArrayIndexes(this.indexes);
            var selectedEvent = this.dialogSettings.events.filter((item) => item.name === this.dialogSettings.selectedEvent),
                oneEvent = selectedEvent[0],
                bgr = oneEvent["backgroundColor"] || this.dialogSettings.defaultBgColor,
                color = oneEvent["color"] || this.dialogSettings.defaultColor,
                message = this.dialogSettings.message || null,
                note = this.settings.editable && this.dialogSettings.personalNote ? this.dialogSettings.personalNote : null,
                eventRange = Calendar.Helpers.ArrayRange(this.indexes.start, this.indexes.end);

            eventRange.forEach((item) => {
                var cell = $('td.cell[data-year-day=' + item + ']');
                cell.addClass('event-day');
                cell.css({ "background-color": bgr, "color": color });
                if(message || note) {
                    Calendar.Popover.popover(cell, message, note);
                }
            });
        }

        /**
         * Removes css styling and attribute `title` from selected cells
         * and destroys popover with messages.
         *
         * @method removeEventFormat
         */
        removeEventFormat(): void {
            var eventRange = Calendar.Helpers.ArrayRange(this.indexes.start, this.indexes.end);
            eventRange.forEach((item) => {
                var cell = $('td.cell[data-year-day=' + item + ']');
                cell.css({ "background-color": "", "color": "" });
                cell.removeAttr("title");
                Calendar.Popover.destroy(cell);
            });
        }

        /**
         * Marks specified cells with css format and adds popover
         * in case message or note for cell is available.
         *
         * @method dataEventFormat
         * @static
         * @param {Array<IData>} data - Server data to select correct cells and apply correct css format
         * @param {Array<IEvent>} events - List of available events
         * @param {number} year - Actual selected year
         */
        static dataEventFormat(data: Array<IData>, events: Array<IEvent>, year: number): void {
            data.forEach((item) => {
                var date = moment(item.date);

                if(date.isValid() && date.year() === year) {
                    var listEv = events.filter(ev => ev.name.toLocaleLowerCase() === item.event.toLocaleLowerCase()),
                        currentEvent = listEv.length ? listEv[0] : events[0],
                        yearDay = date.dayOfYear(),
                        cell = $('td.cell[data-year-day=' + yearDay + ']');

                    cell.addClass('event-day');
                    cell.css({ "background-color": currentEvent.backgroundColor, "color": currentEvent.color });
                    if(item.message || item.note) {
                        Calendar.Popover.popover(cell, item.message, item.note);
                    }
                }
            });
        }

        /**
         * Resolves left mouse pressing.
         *
         * @method leftMousePressed
         * @private
         * @param {JQueryEventObject} e - Event handler object
         * @return {boolean} - Whether the left mouse button has been pressed
         */
        private leftMousePressed(e: JQueryEventObject): boolean {
            var event = window.event;
            var button = e.which || event.button;
            return button === 1;
        }

        /**
         * Remove values from `this.index` property after `mouseup` event
         * to use for other selection.
         *
         * @method resetIndexes
         * @private
         */
        private resetIndexes(): void {
            this.indexes = { start: null, end: null };
        }
    }
}