/**
 * Created by Marcela on 2. 5. 2015.
 */

///<reference path="../typing/jquery.d.ts" />
///<reference path="../typing/moment.d.ts" />
///<reference path="common.ts" />
///<reference path="helpers.ts" />
///<reference path="modal.ts" />

module Calendar {

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
    export class CalendarEvents {
        element: JQuery;
        settings: ISettings;
        indexes: IArrayIndexes;
        year: number;
        dialogSettings: IModalDialog = {
            start: null,
            end: null,
            events: [],
            selectedEvent: ""
        };

        constructor(element: JQuery, settings: ISettings) {
            this.element = element;
            this.settings = settings;
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
            this.resetIndexes();
        }

        showModal(): void {
            var modal = new Dialog(this.dialogSettings);
            modal.show().then((result) => {
                var dialogResult = result == DialogResult.Submit ?
                    "Submit form" : result == DialogResult.Reset ?
                    "Reset events" : "Cancel events";
                console.log(dialogResult);
                console.log(modal.dialogSettings);
            });
        }

        /**
         * Resolves left mouse pressing.
         *
         * @method leftMousePressed
         * @private
         * @param {JQueryEventObject} e - Event handler object
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