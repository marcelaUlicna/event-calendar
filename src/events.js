///<reference path="../typing/jquery.d.ts" />
///<reference path="../typing/moment.d.ts" />
///<reference path="common.ts" />
///<reference path="helpers.ts" />
///<reference path="modal.ts" />
///<reference path="popover.ts" />
var Calendar;
(function (Calendar) {
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
    var Events = (function () {
        function Events(element, settings) {
            var _this = this;
            /**
             * Modal dialog settings.
             *
             * @property dialogSettings
             * @type {IModalDialog}
             */
            this.dialogSettings = {
                start: null,
                end: null,
                events: [],
                selectedEvent: "",
                defaultBgColor: "#5CB85C",
                defaultColor: "white",
                localization: null
            };
            this.element = element;
            this.settings = settings;
            this.dialogSettings.localization = this.settings.localization;
            this.dialogSettings.events = this.settings.events;
            this.dialogSettings.selectedEvent = this.settings.events[0].name;
            this.resetIndexes();
            if (this.settings.editable) {
                this.element.on("mouseup mouseover mousedown", "td.cell", function (e) {
                    _this[e.type](e);
                });
            }
        }
        /**
         * Sets selected year to local variable.
         *
         * @method setSelectedlYear
         * @param {number} year - Selected year
         */
        Events.prototype.setSelectedlYear = function (year) {
            this.year = year;
        };
        /**
         * Implements mousedown event. Sets start index and adds selected class to actual cell.
         *
         * @method mousedown
         * @param {JQueryEventObject} e - Event handler object
         */
        Events.prototype.mousedown = function (e) {
            if (!this.leftMousePressed(e))
                return;
            e.preventDefault();
            var cellElement = $(e.target).closest('td'), index = cellElement.attr('data-year-day');
            if (!index)
                return;
            $('td.cell').removeClass('selected-day');
            this.indexes = { start: Number(index), end: Number(index) };
            cellElement.addClass('selected-day');
        };
        /**
         * Implements mouseover event. Sets end index, calculates range of selected cells
         * and adds selected class to all cells according to calculated range.
         *
         * @method mouseover
         * @param {JQueryEventObject} e - Event handler object
         */
        Events.prototype.mouseover = function (e) {
            e.preventDefault();
            if (!this.indexes.start)
                return;
            var cellElement = $(e.target).closest('td'), index = cellElement.attr('data-year-day');
            if (isNaN(Number(index)))
                return;
            this.indexes.end = Number(index);
            if (this.indexes.start !== this.indexes.end) {
                $('td.cell').removeClass('selected-day');
                var idx = Calendar.Helpers.ArrayIndexes(this.indexes), selectedRange = Calendar.Helpers.ArrayRange(idx.start, idx.end);
                selectedRange.forEach(function (item) {
                    var selector = 'td.cell[data-year-day=' + item + ']';
                    $(selector).addClass('selected-day');
                });
            }
        };
        /**
         * Implements mouseup event. Sets end index, calculates start and end dates
         * from indexes and calls modal dialog to enter personal event. At the end resets start and end indexes.
         *
         * @method mouseup
         * @param {JQueryEventObject} e - Event handler object
         */
        Events.prototype.mouseup = function (e) {
            e.preventDefault();
            if (!this.indexes.start || !this.indexes.end)
                return;
            var idx = Calendar.Helpers.ArrayIndexes(this.indexes);
            this.dialogSettings.start = moment([this.year]).dayOfYear(idx.start);
            this.dialogSettings.end = moment([this.year]).dayOfYear(idx.end);
            this.showModal();
        };
        /**
         * Displays modal dialog with settings and action and handlers events "Submit" or "Delete"
         * based on clicked button. After that calls removing selection styling.
         *
         * @method showModal
         */
        Events.prototype.showModal = function () {
            var _this = this;
            var modal = new Calendar.Dialog(this.dialogSettings);
            modal.show().then(function (result) {
                if (result === 0 /* Submit */) {
                    _this.dialogSettings = modal.dialogSettings;
                    _this.submitChanges();
                }
                else if (result === 1 /* Delete */) {
                    _this.deleteItems();
                }
                _this.removeSelection();
            });
        };
        /**
         * Removes class `selected-day` used for marking selection and calls `resetIndexes()`.
         *
         * @method removeSelection
         *
         */
        Events.prototype.removeSelection = function () {
            this.element.find("td").removeClass("selected-day");
            this.resetIndexes();
            this.dialogSettings.personalNote = null;
            this.dialogSettings.message = null;
            this.dialogSettings.selectedEvent = this.settings.events[0].name;
        };
        /**
         * Submit action. Applies css style for selected event on client side.
         * Calls `TODO: Submit server implementation` for server side implementation.
         *
         * @method submitChanges
         */
        Events.prototype.submitChanges = function () {
            // user implementation
            this.applyEventFormat();
        };
        /**
         * Delete action. Remove css style on client side.
         * Calls `TODO: Delete server implementation` for server side implementation.
         *
         * @method deleteItems
         */
        Events.prototype.deleteItems = function () {
            // user implementation
            this.removeEventFormat();
        };
        /**
         * Sets css styling to each cell in range of selected indexes according to
         * selected event and its properties (background color, color), sets title
         * if any of messages is typed. Adds class `event-day` to each cell and initializes
         * popover with messages.
         *
         * @method applyEventFormat
         */
        Events.prototype.applyEventFormat = function () {
            var _this = this;
            var selectedEvent = this.dialogSettings.events.filter(function (item) { return item.name === _this.dialogSettings.selectedEvent; }), oneEvent = selectedEvent[0], bgr = oneEvent["backgroundColor"] || this.dialogSettings.defaultBgColor, color = oneEvent["color"] || this.dialogSettings.defaultColor, message = this.dialogSettings.message || null, note = this.settings.editable && this.dialogSettings.personalNote ? this.dialogSettings.personalNote : null, eventRange = Calendar.Helpers.ArrayRange(this.indexes.start, this.indexes.end);
            eventRange.forEach(function (item) {
                var cell = $('td.cell[data-year-day=' + item + ']');
                cell.addClass('event-day');
                cell.css({ "background-color": bgr, "color": color });
                if (message || note) {
                    Calendar.Popover.popover(cell, message, note);
                }
            });
        };
        /**
         * Removes css styling and attribute `title` from selected cells
         * and destroys popover with messages.
         *
         * @method removeEventFormat
         */
        Events.prototype.removeEventFormat = function () {
            var eventRange = Calendar.Helpers.ArrayRange(this.indexes.start, this.indexes.end);
            eventRange.forEach(function (item) {
                var cell = $('td.cell[data-year-day=' + item + ']');
                cell.css({ "background-color": "", "color": "" });
                cell.removeAttr("title");
                Calendar.Popover.destroy(cell);
            });
        };
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
        Events.dataEventFormat = function (data, events, year) {
            data.forEach(function (item) {
                var date = moment(item.date);
                if (date.isValid() && date.year() === year) {
                    var listEv = events.filter(function (ev) { return ev.name.toLocaleLowerCase() === item.event.toLocaleLowerCase(); }), currentEvent = listEv.length ? listEv[0] : events[0], yearDay = date.dayOfYear(), cell = $('td.cell[data-year-day=' + yearDay + ']');
                    cell.addClass('event-day');
                    cell.css({ "background-color": currentEvent.backgroundColor, "color": currentEvent.color });
                    if (item.message || item.note) {
                        Calendar.Popover.popover(cell, item.message, item.note);
                    }
                }
            });
        };
        /**
         * Resolves left mouse pressing.
         *
         * @method leftMousePressed
         * @private
         * @param {JQueryEventObject} e - Event handler object
         * @return {boolean} - Whether the left mouse button has been pressed
         */
        Events.prototype.leftMousePressed = function (e) {
            var event = window.event;
            var button = e.which || event.button;
            return button === 1;
        };
        /**
         * Remove values from `this.index` property after `mouseup` event
         * to use for other selection.
         *
         * @method resetIndexes
         * @private
         */
        Events.prototype.resetIndexes = function () {
            this.indexes = { start: null, end: null };
        };
        return Events;
    })();
    Calendar.Events = Events;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=events.js.map