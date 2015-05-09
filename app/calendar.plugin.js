/**
 * Created by Marcela on 28. 4. 2015.
 */
///<reference path="../typing/jquery.d.ts" />
var Calendar;
(function (Calendar) {
    (function (DialogResult) {
        DialogResult[DialogResult["Submit"] = 0] = "Submit";
        DialogResult[DialogResult["Delete"] = 1] = "Delete";
        DialogResult[DialogResult["Cancel"] = 2] = "Cancel";
    })(Calendar.DialogResult || (Calendar.DialogResult = {}));
    var DialogResult = Calendar.DialogResult;
})(Calendar || (Calendar = {}));
/**
 * Created by Marcela on 28. 4. 2015.
 */
///<reference path="../typing/jquery.d.ts" />
///<reference path="common.ts" />
var Calendar;
(function (Calendar) {
    /**
     * This provides various helpers.
     *
     * @class Helpers
     */
    var Helpers = (function () {
        function Helpers() {
        }
        /**
         * Utility that creates new array according to specified values (`from` and `to`).
         * If there is the specified input array, the result will contain elements
         * from this array, otherwise there will be a sequence of integers in the range
         * of each of the given values.
         *
         * This is an __example__ of usage `ArrayRange` method
         *
         *     var array = [1, 2, 4, 5, 6, 8, 9, 21, 22, 45],
         *         from = 2,
         *         to = 10;
         *
         *     Calendar.Helpers.ArrayRange(2, 10, array);
         *     // => [2, 4, 5, 6, 8, 9]
         *
         *     // example of unsorted array
         *     Calendar.Helpers.ArrayRange(2, 10, [1, 6, 2, 5, 6, 7, 4, 5]);
         *     // => [2, 4, 5, 6, 7]
         *
         *     // example without input array
         *     Calendar.Helpers.ArrayRange(2, 10);
         *     // => [2, 3, 4, 5, 6, 7, 8, 9, 10]
         *
         *
         * @method ArrayRange
         * @static
         * @param {number} from - Start value
         * @param {number} to - End value
         * @param {Array<number>} [array] - Input array
         *
         * @return {Array<number>} - Array of integers
        */
        Helpers.ArrayRange = function (from, to, array) {
            var A = [], step = 1;
            if (Object.prototype.toString.call(array) === '[object Array]') {
                while (from <= to) {
                    if (!!~array.indexOf(from)) {
                        A.push(from);
                    }
                    from += step;
                }
            }
            else {
                while (from <= to) {
                    A.push(from);
                    from += step;
                }
            }
            return A;
        };
        /**
         * Provides the correct order of start and end indexes
         *
         * @method ArrayIndexes
         * @static
         * @param {IArrayIndexes} indexes - Object with start and end value
         * @return {IArrayIndexes} - Correct start and end index
         */
        Helpers.ArrayIndexes = function (indexes) {
            if (indexes.start <= indexes.end) {
                return indexes;
            }
            return {
                start: indexes.end,
                end: indexes.start
            };
        };
        /**
         * Capitalizes the first letter of the text.
         *
         * @method CapitalizeFirstLetter
         * @static
         * @param {string} text - Text
         * @return {string} - Text with capitalized first char
         */
        Helpers.CapitalizeFirstLetter = function (text) {
            return text.charAt(0).toUpperCase() + text.slice(1);
        };
        /**
         * Renders template - replaces placeholders in template with values from dictionary.
         *
         * @method RenderTemplate
         * @static
         * @param {string} template - Given template
         * @param {[key: string]: any} dict - Dictionary with keys and values
         * @return {string} - Template
         * */
        Helpers.RenderTemplate = function (template, dict) {
            return template.replace(/\{\{(.*?)\}\}/g, function (match, key) {
                var value = dict, keys = key.split(".");
                for (var i = 0, length = keys.length; i < length; i++) {
                    if (typeof value === "undefined" || value === null) {
                        break;
                    }
                    value = value[keys[i]];
                }
                return typeof value === "undefined" ? "" : value;
            });
        };
        return Helpers;
    })();
    Calendar.Helpers = Helpers;
})(Calendar || (Calendar = {}));
/**
 * Created by Marcela on 5. 5. 2015.
 */
///<reference path="../typing/jquery.d.ts" />
///<reference path="../typing/bootstrap.d.ts" />
///<reference path="../typing/moment.d.ts" />
///<reference path="common.ts" />
///<reference path="helpers" />
var Calendar;
(function (Calendar) {
    /**
     * Implements modal dialog which contains selected start and end date,
     * component with events to be selected and inputs where user can type
     * some message for other person and/or note for himself. There is available
     * both Submit and Delete button and the cross for closing dialog without
     * applying any changes.
     *
     * @class Dialog
     * @constructor
     * @param {IModalDialog} dialogSettings - Modal dialog settings
     * @property {IModalDialog} dialogSettings - Modal dialog settings
     * @property {[key: string]: any} templateDictionary - Dictionary of placeholders and values necessary for rendering template
     * @property {JQuery} modal - Dialog element
     * @property {DialogResult} [dialogResult=DialogResult.Cancel] - Result of dialog event
     */
    var Dialog = (function () {
        function Dialog(dialogSettings) {
            this.dialogResult = 2 /* Cancel */;
            this.dialogSettings = dialogSettings;
            this.dialogSettings.selectedEvent = this.dialogSettings.events[0].name;
            this.templateDictionary = this.getDictionary();
        }
        /**
         * Fills `templateDictionary` with keys and its values.
         *
         * @method getDictionary
         * @private
         * @return {any} - Returns dictionary template
         */
        Dialog.prototype.getDictionary = function () {
            return {
                "title": "Modal title",
                "start": moment(this.dialogSettings.start).format("LL"),
                "end": moment(this.dialogSettings.end).format("LL"),
                "dropdown": Calendar.ModalTemplate.dropdownTemplate(this.dialogSettings)
            };
        };
        /**
         * Renders modal dialog and binds all necessary events. After closing modal dialog
         * it is removed from DOM.
         *
         * @method show
         * @returns {JQueryPromise<DialogResult>} - Returns promise from modal dialog with dialog result
         */
        Dialog.prototype.show = function () {
            var _this = this;
            var deferred = $.Deferred();
            this.modal = $(Calendar.Helpers.RenderTemplate(Calendar.ModalTemplate.template(), this.templateDictionary)).appendTo($("body"));
            this.modal.modal();
            this.modal.on("click", ".modal-body .dropdown-menu li", function (e) { return _this.selectChange(e); });
            this.modal.on("change", "input", function (e) { return _this.messageChanged(e); });
            this.modal.on("click", ".modal-body .btn-action", function (e) { return _this.click(e); });
            this.modal.on("hidden.bs.modal", function () {
                _this.modal.remove();
                deferred.resolve(_this.dialogResult);
            });
            return deferred.promise();
        };
        /**
         * Resolves button click from dialog and calls appropriate method.
         *
         * @method click
         * @param {JQueryEventObject} e - Button object handler
         */
        Dialog.prototype.click = function (e) {
            var action = $(e.target).attr("id");
            this[action](e);
            this.close();
        };
        /**
         * Sets dialogResult to `DialogResult.Submit`.
         *
         * @method btnSubmit
         * @param {JQueryEventObject} e - Button object handler
         */
        Dialog.prototype.btnSubmit = function (e) {
            this.dialogResult = 0 /* Submit */;
        };
        /**
         * Sets dialogResult to `DialogResult.Delete`.
         *
         * @method btnDelete
         * @param {JQueryEventObject} e - Button object handler
         */
        Dialog.prototype.btnDelete = function (e) {
            this.dialogResult = 1 /* Delete */;
        };
        /**
         * Sets dialogResult to `DialogResult.Cancel`.
         *
         * @method btnClose
         * @param {JQueryEventObject} e - Button object handler
         */
        Dialog.prototype.btnClose = function (e) {
            this.dialogResult = 2 /* Cancel */;
        };
        /**
         * Closes modal dialog.
         *
         * @method close
         */
        Dialog.prototype.close = function () {
            this.modal.modal("hide");
        };
        /**
         * Applies changes after selecting some event from list component,
         * saves selected item to `dialogSettings` property and
         * sets selected item to main button to reflect actual item.
         *
         * @method selectChange
         * @param {JQueryEventObject} e - Selected item event handler
         */
        Dialog.prototype.selectChange = function (e) {
            var li = $(e.target).closest("li");
            this.dialogSettings.selectedEvent = li.attr("data-value");
            var html = li.find("a").html(), faIndex = html.indexOf("<i class"), htmlWithCaret = html.slice(0, faIndex) + " <span class='caret pull-right'></span>" + html.slice(faIndex);
            $(".calendar-modal .dropdown-toggle").html(htmlWithCaret);
        };
        /**
         * Saves input text to `dialogSettings` property.
         *
         * @method messageChanged
         * @param {JQueryEventObject} e - Input event handler
         */
        Dialog.prototype.messageChanged = function (e) {
            var input = $(e.target);
            if (input.attr("name") === "userMessage") {
                this.dialogSettings.message = input.val();
            }
            else {
                this.dialogSettings.personalNote = input.val();
            }
        };
        return Dialog;
    })();
    Calendar.Dialog = Dialog;
    /**
     * Static class which contains templates for modal dialog
     *
     * @class ModalTemplate
     * @static
     */
    var ModalTemplate = (function () {
        function ModalTemplate() {
        }
        /**
         * Whole modal dialog html template.
         *
         * @method template
         * @static
         * @return {string} - Returns template
         */
        ModalTemplate.template = function () {
            return [
                "<div class='modal calendar-modal' tabindex='-1' role='dialog' aria-hidden='true'>",
                "  <div class='modal-dialog modal-sm'>",
                "    <div class='modal-content'>",
                "       <div class='modal-header'  style='border-bottom: none;'>",
                "           <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>",
                "       </div>",
                "       <div class='modal-body' style='padding-top: 0;'>",
                "           <div class='row' style='padding-bottom: 15px;'>",
                "               <div class='col-md-12'><i class='fa fa-calendar-o'></i> {{start}}</div>",
                "               <div class='col-md-12'><i class='fa fa-calendar-o'></i> {{end}}</div>",
                "           </div>",
                "           <div class='row' style='padding-bottom: 15px;'>",
                "               <div class='col-md-12'>{{dropdown}}</div>",
                "           </div>",
                "           <form>",
                "               <div class='form-group'>",
                "                   <div>Information (users will see this message)</div>",
                "                   <input type='text' name='userMessage' class='form-control'>",
                "               </div>",
                "               <div class='form-group'>",
                "                   <div>Notes (only you will see this message)</div>",
                "                   <input type='text' name='privateNote' class='form-control'>",
                "               </div>",
                "           </form>",
                "           <div class='row'>",
                "               <div class='col-md-12'>",
                "                   <button type='button' id='btnDelete' class='btn btn-default pull-left btn-action'>Delete</button>",
                "                   <button type='button' id='btnSubmit' class='btn btn-primary pull-right btn-action'>Submit</button>",
                "               </div>",
                "           </div>",
                "       </div>",
                "    </div>",
                "  </div>",
                "</div>"
            ].join("\n");
        };
        /**
         * Template for dropdown component with events.
         *
         * @method dropdownTemplate
         * @static
         * @param {IModalDialog} dialogSettings - Modal dialog settings
         * @return {string} - Returns partial template
         */
        ModalTemplate.dropdownTemplate = function (dialogSettings) {
            var _this = this;
            var firstEvent = dialogSettings.events[0];
            var dropdownlist = dialogSettings.events.map(function (item) {
                return Calendar.Helpers.RenderTemplate(_this.dropdownList, {
                    "value": item.name,
                    "backgroundColor": item.backgroundColor || dialogSettings.defaultBgColor
                });
            });
            return Calendar.Helpers.RenderTemplate(this.dropdownButton, {
                "value": firstEvent.name,
                "backgroundColor": firstEvent.backgroundColor || dialogSettings.defaultBgColor,
                "dropdownlist": dropdownlist.join("")
            });
        };
        ModalTemplate.dropdownButton = [
            "<div class='btn-group' role='group'>",
            "   <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-expanded='false'>",
            "       {{value}}",
            "       <span class='caret pull-right'></span>",
            "       <i class='fa fa-square pull-right' style='color: {{backgroundColor}}'></i>",
            "   </button>",
            "   <ul class='dropdown-menu' role='menu'>",
            "       {{dropdownlist}}",
            "   </ul>",
            "</div>"
        ].join("\n");
        ModalTemplate.dropdownList = "<li data-value='{{value}}'><a href='#'>{{value}}<i class='fa fa-square pull-right' style='color: {{backgroundColor}};'></i></a></li>";
        return ModalTemplate;
    })();
    Calendar.ModalTemplate = ModalTemplate;
})(Calendar || (Calendar = {}));
/**
 * Created by Marcela on 29. 4. 2015.
 */
///<reference path="../typing/jquery.d.ts" />
var Calendar;
(function (Calendar) {
    /**
     * Renders header of plugin. Contains actual year and navigation
     * to previous and next year.
     *
     * @class Header
     * @constructor
     * @property {JQuery} element - Header DOM element
     * @property {number} year - Actual year
     */
    var Header = (function () {
        function Header(year) {
            this.year = year;
            this.element = this.render();
        }
        /**
         * Creates whole header elements.
         *
         * @method render
         * @return JQuery
         */
        Header.prototype.render = function () {
            return $("<div />").addClass("row calendar-header").append(this.renderHeader());
        };
        /**
         * Creates main header element and appends navigation buttons
         * and title.
         *
         * @method renderHeader
         * @return JQuery
         */
        Header.prototype.renderHeader = function () {
            return $("<div />").addClass("col-md-12").append($("<div />").addClass("pull-left").append(this.renderButton("prev")).append(this.renderTitle()).append(this.renderButton("next")));
        };
        /**
         * Creates navigation button.
         *
         * @method renderButton
         * @param {string} direction - Direction (prev or next)
         * @return JQuery
         */
        Header.prototype.renderButton = function (direction) {
            var yearValue = direction === "prev" ? this.year - 1 : this.year + 1, iconClass = direction === "prev" ? "fa fa-chevron-left" : "fa fa-chevron-right";
            return $("<div />").addClass("btn btn-default year-direction").attr("type", "button").attr("name", "year").attr("data-direction", direction).attr("value", yearValue).append($("<span />").addClass(iconClass));
        };
        /**
         * Creates year title.
         *
         * @method renderTitle
         * @return JQuery
         */
        Header.prototype.renderTitle = function () {
            return $("<div />").addClass("actual-year").attr("data-year", this.year).append($("<strong />").text(this.year));
        };
        return Header;
    })();
    Calendar.Header = Header;
})(Calendar || (Calendar = {}));
/**
 * Created by Marcela on 9. 5. 2015.
 */
///<reference path="../typing/jquery.d.ts" />
///<reference path="../typing/bootstrap.d.ts" />
var Calendar;
(function (Calendar) {
    /**
     * Implements bootstrap popover for each cell with any event.
     * Shows both message for other people and personal note if it is available.
     * It is triggered by hover.
     *
     * @class Popover
     * @static
     */
    var Popover = (function () {
        function Popover() {
        }
        /**
         * Initializes popover for cell element.
         *
         * @method Popover
         * @static
         * @param {JQuery} cell - Cell element to apply popover
         * @param {string} [message] - Message text
         * @param {string} [note] - Note text for creator
         */
        Popover.Popover = function (cell, message, note) {
            var _this = this;
            cell.popover({
                container: 'body',
                html: true,
                placement: 'top',
                trigger: 'hover',
                content: function () {
                    return _this.template(message, note);
                }
            });
        };
        /**
         * Popover content.
         *
         * @method template
         * @static
         * @param {string} [message] - Message text
         * @param {string} [note] - Note text for creator
         * @return {string} - Template
         */
        Popover.template = function (message, note) {
            var messageTmp = message && message.length ? this.messageTmp.replace("{{message}}", message) : "", noteTmp = note && note.length ? this.noteTmp.replace("{{note}}", note) : "";
            return "<div>" + noteTmp + messageTmp + "</div>";
        };
        Popover.messageTmp = "<div><i class='fa fa-comment-o'></i> {{message}}</div>";
        Popover.noteTmp = "<div><i class='fa fa-pencil-square-o'></i> {{note}}</div>";
        return Popover;
    })();
    Calendar.Popover = Popover;
})(Calendar || (Calendar = {}));
/**
 * Created by Marcela on 29. 4. 2015.
 */
///<reference path="../typing/jquery.d.ts" />
///<reference path="../typing/moment.d.ts" />
///<reference path="common.ts" />
///<reference path="helpers.ts" />
/*
* moment.locale("cs-cz")
*
* moment.months()
* ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"]
* ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
* ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"]
*
* moment.weekdaysMin()
* ["ne", "po", "út", "st", "čt", "pá", "so"]
* ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"]
* ["вс", "пн", "вт", "ср", "чт", "пт", "сб"]
* */
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
     * @property {JQuery} element - Month calendars DOM element
     * @property {ISettings} settings - Plugin settings
     * @property {number} year - Actual year of calendar
     * @property {Date} today - Javascript Date object
     * @property {Array<string>} months - Array of month names
     * @property {Array<string>} weekdays - Array of weekdays shortcuts
     */
    var MonthCalendar = (function () {
        function MonthCalendar(settings, year) {
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
         * @return {JQuery}
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
         * @return {JQuery}
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
                        // set vacation
                        // TODO ============
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
/**
 * Created by Marcela on 2. 5. 2015.
 */
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
     * @class CalendarEvents
     * @constructor
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
                selectedEvent: "",
                defaultBgColor: "green",
                defaultColor: "white"
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
        /**
         * Displays modal dialog with settings and action and handlers events "Submit" or "Delete"
         * based on clicked button. After that calls removing selection styling.
         *
         * @method showModal
         */
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
        /**
         * Removes class `selected-day` used for marking selection and calls `resetIndexes()`.
         *
         * @method removeSelection
         *
         */
        CalendarEvents.prototype.removeSelection = function () {
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
        CalendarEvents.prototype.submitChanges = function () {
            // user implementation
            this.applyEventFormat();
        };
        /**
         * Delete action. Remove css style on client side.
         * Calls `TODO: Delete server implementation` for server side implementation.
         *
         * @method deleteItems
         */
        CalendarEvents.prototype.deleteItems = function () {
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
        CalendarEvents.prototype.applyEventFormat = function () {
            var _this = this;
            var selectedEvent = this.dialogSettings.events.filter(function (item) { return item.name === _this.dialogSettings.selectedEvent; }), oneEvent = selectedEvent[0], bgr = oneEvent["backgroundColor"] || this.dialogSettings.defaultBgColor, color = oneEvent["color"] || this.dialogSettings.defaultColor, message = this.dialogSettings.message || null, note = this.settings.editable && this.dialogSettings.personalNote ? this.dialogSettings.personalNote : null, eventRange = Calendar.Helpers.ArrayRange(this.indexes.start, this.indexes.end);
            eventRange.forEach(function (item) {
                var cell = $('td.cell[data-year-day=' + item + ']');
                cell.addClass('event-day');
                cell.css({ "background-color": bgr, "color": color });
                if (message || note) {
                    Calendar.Popover.Popover(cell, message, note);
                }
            });
        };
        /**
         * Removes css styling and attribute `title` from selected cells.
         *
         * @method removeEventFormat
         */
        CalendarEvents.prototype.removeEventFormat = function () {
            var eventRange = Calendar.Helpers.ArrayRange(this.indexes.start, this.indexes.end);
            eventRange.forEach(function (item) {
                var cell = $('td.cell[data-year-day=' + item + ']');
                cell.css({ "background-color": "", "color": "" });
            });
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
