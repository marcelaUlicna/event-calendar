/**
 * Created by Marcela on 28. 4. 2015.
 */
///<reference path="../typing/jquery.d.ts" />
var Calendar;
(function (Calendar) {
    (function (DialogResult) {
        DialogResult[DialogResult["Submit"] = 0] = "Submit";
        DialogResult[DialogResult["Reset"] = 1] = "Reset";
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
         *     var array = [1,2,4,5,6,8,9,21,22,45],
         *         from = 2,
         *         to = 10;
         *
         *     Calendar.Helpers.ArrayRange(2,10,array);
         *     // => [2, 4, 5, 6, 8, 9]
         *
         *     // example of unsorted array
         *     Calendar.Helpers.ArrayRange(2,10,1,6,2,5,6,7,4,5]);
         *     // => [2, 4, 5, 6, 7]
         *
         *     // example without input array
         *     Calendar.Helpers.ArrayRange(2,10);
         *     // => [2, 3, 4, 5, 6, 7, 8, 9, 10]
         *
         *
         * @method ArrayRange
         * @static
         * @param {number} from - Start value
         * @param {number} to - End value
         * @param {Array<number>} [array] - Input array
         *
         * @return {Array<number>}
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
         * @return {IArrayIndexes}
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
         * @return {string}
         */
        Helpers.CapitalizeFirstLetter = function (text) {
            return text.charAt(0).toUpperCase() + text.slice(1);
        };
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
    var Dialog = (function () {
        function Dialog(dialogSettings) {
            this.dialogResult = 2 /* Cancel */;
            this.template = [
                "<div class='modal' tabindex='-1' role='dialog' aria-hidden='true'>",
                "  <div class='modal-dialog modal-sm'>",
                "    <div class='modal-content'>",
                "       <div class='modal-header'>",
                "           <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>",
                "           <h4 class='modal-title'>{{title}}</h4>",
                "       </div>",
                "       <div class='modal-body'>",
                "           <div class='row'>",
                "               <div class='col-md-4'>Start date:</div>",
                "               <div class='col-md-8'>{{start}}</div>",
                "           </div>",
                "           <div class='row'>",
                "               <div class='col-md-4'>End date:</div>",
                "               <div class='col-md-8'>{{end}}</div>",
                "           </div>",
                "           <hr>",
                "           <div class='row'>",
                "               <div class='col-md-4'>Events:</div>",
                "               <div class='col-md-8'><select class='select-event form-control'>{{options}}</select></div>",
                "           </div>",
                "           <hr>",
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
                "       </div>",
                "       <div class='modal-footer'>",
                "           <button type='button' id='btnSubmit' class='btn btn-primary'>Submit</button>",
                "           <button type='button' id='btnReset' class='btn btn-default'>Reset</button>",
                "           <button type='button' id='btnClose' class='btn btn-default' data-dismiss='modal'>Close</button>",
                "       </div>",
                "    </div>",
                "  </div>",
                "</div>"
            ].join("\n");
            this.dialogSettings = dialogSettings;
            this.templateDictionary = this.getDictionary();
        }
        Dialog.prototype.getDictionary = function () {
            return {
                "title": "Modal title",
                "start": moment(this.dialogSettings.start).format("LL"),
                "end": moment(this.dialogSettings.end).format("LL"),
                "options": this.optionTemplate()
            };
        };
        Dialog.prototype.show = function () {
            var _this = this;
            var deferred = $.Deferred();
            this.modal = $(Calendar.Helpers.RenderTemplate(this.template, this.templateDictionary)).appendTo($("body"));
            this.modal.modal();
            this.modal.on("change", "select.select-event", function (e) { return _this.selectChange(e); });
            this.modal.on("change", "input", function (e) { return _this.messageChanged(e); });
            this.modal.on("click", ".modal-footer button", function (e) { return _this.click(e); });
            this.modal.on("hidden.bs.modal", function () {
                _this.modal.remove();
                deferred.resolve(_this.dialogResult);
            });
            return deferred.promise();
        };
        Dialog.prototype.click = function (e) {
            var action = $(e.target).attr("id");
            this[action](e);
            this.close();
        };
        Dialog.prototype.btnSubmit = function (e) {
            this.dialogResult = 0 /* Submit */;
        };
        Dialog.prototype.btnReset = function (e) {
            this.dialogResult = 1 /* Reset */;
        };
        Dialog.prototype.btnClose = function (e) {
            this.dialogResult = 2 /* Cancel */;
        };
        Dialog.prototype.close = function () {
            this.modal.modal("hide");
        };
        Dialog.prototype.selectChange = function (e) {
            this.dialogSettings.selectedEvent = this.modal.find("select.select-event option:selected").first().attr("value");
        };
        Dialog.prototype.messageChanged = function (e) {
            var input = $(e.target);
            if (input.attr("name") === "userMessage") {
                this.dialogSettings.message = input.val();
            }
            else {
                this.dialogSettings.personalNote = input.val();
            }
        };
        Dialog.prototype.optionTemplate = function () {
            var template = "<option value='{{value}}' style='background-color: {{color}};'>{{value}}</option>";
            var options = this.dialogSettings.events.map(function (item) {
                return Calendar.Helpers.RenderTemplate(template, { "value": item.name, "color": item.color });
            });
            return options.join("");
        };
        return Dialog;
    })();
    Calendar.Dialog = Dialog;
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
            this.resetIndexes();
        };
        CalendarEvents.prototype.showModal = function () {
            var modal = new Calendar.Dialog(this.dialogSettings);
            modal.show().then(function (result) {
                var dialogResult = result == 0 /* Submit */ ? "Submit form" : result == 1 /* Reset */ ? "Reset events" : "Cancel events";
                console.log(dialogResult);
                console.log(modal.dialogSettings);
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
                events: [{
                    name: "Default",
                    color: "green"
                }],
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
