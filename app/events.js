/**
 * Created by Marcela on 2. 5. 2015.
 */
///<reference path="../typing/jquery.d.ts" />
///<reference path="../typing/moment.d.ts" />
///<reference path="common.ts" />
///<reference path="helpers.ts" />
///<reference path="modal.ts" />
var Calendar;
(function (Calendar) {
    /**
     * Implements mouse event handlers and provides selected range
     * of days indexes and sets selected class.
     *
     * @class CalendarEvents
     * @param {JQuery} element - Calendar jquery element
     * @param {ISettings} settings - Plugin settings
     * @property {JQuery} element - Calendar jquery element
     * @property {ISettings} settings - Plugin settings
     * @property {IArrayIndexes} indexes - Object that persists start and end index
     * @property {number} year - Selected year
     */
    var CalendarEvents = (function () {
        function CalendarEvents(element, settings) {
            var _this = this;
            this.dialogSettings = {
                start: null,
                end: null,
                events: [],
                selectedEvent: ""
            };
            this.element = element;
            this.settings = settings;
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
        CalendarEvents.prototype.setSelectedlYear = function (year) {
            this.year = year;
        };
        /**
         * Implements mousedown event. Sets start index and adds selected class to actual cell.
         *
         * @method mousedown
         * @param {JQueryEventObject} e - Event handler object
         */
        CalendarEvents.prototype.mousedown = function (e) {
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
        CalendarEvents.prototype.mouseover = function (e) {
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
        CalendarEvents.prototype.mouseup = function (e) {
            e.preventDefault();
            if (!this.indexes.start || !this.indexes.end)
                return;
            var idx = Calendar.Helpers.ArrayIndexes(this.indexes);
            this.dialogSettings.start = moment([this.year]).dayOfYear(idx.start);
            this.dialogSettings.end = moment([this.year]).dayOfYear(idx.end);
            this.showModal();
        };
        CalendarEvents.prototype.showModal = function () {
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
        CalendarEvents.prototype.removeSelection = function () {
            this.element.find("td").removeClass("selected-day");
        };
        CalendarEvents.prototype.submitChanges = function () {
            // user implementation
            this.applyEventFormat();
        };
        CalendarEvents.prototype.deleteItems = function () {
            // user implementation
            this.removeEventFormat();
        };
        CalendarEvents.prototype.applyEventFormat = function () {
            var _this = this;
            var selectedEvent = this.dialogSettings.events.filter(function (item) { return item.name === _this.dialogSettings.selectedEvent; }), oneEvent = selectedEvent[0], bgr = oneEvent["backgroundColor"] != null ? oneEvent["backgroundColor"] : "green", color = oneEvent["color"] != null ? oneEvent["color"] : "white", title = this.dialogSettings.personalNote + " : " + this.dialogSettings.message, eventRange = Calendar.Helpers.ArrayRange(this.indexes.start, this.indexes.end);
            eventRange.forEach(function (item) {
                var cell = $('td.cell[data-year-day=' + item + ']');
                cell.addClass('event-day');
                cell.css({ "background-color": bgr, "color": color });
                cell.attr("title", title);
            });
            this.resetIndexes();
        };
        CalendarEvents.prototype.removeEventFormat = function () {
            var eventRange = Calendar.Helpers.ArrayRange(this.indexes.start, this.indexes.end);
            eventRange.forEach(function (item) {
                var cell = $('td.cell[data-year-day=' + item + ']');
                cell.css({ "background-color": "", "color": "" });
                cell.removeAttr("title");
            });
            this.resetIndexes();
        };
        /**
         * Resolves left mouse pressing.
         *
         * @method leftMousePressed
         * @private
         * @param {JQueryEventObject} e - Event handler object
         */
        CalendarEvents.prototype.leftMousePressed = function (e) {
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
        CalendarEvents.prototype.resetIndexes = function () {
            this.indexes = { start: null, end: null };
        };
        return CalendarEvents;
    })();
    Calendar.CalendarEvents = CalendarEvents;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=events.js.map