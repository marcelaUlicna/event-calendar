var Calendar;
(function (Calendar) {
    (function (DialogResult) {
        DialogResult[DialogResult["Submit"] = 0] = "Submit";
        DialogResult[DialogResult["Delete"] = 1] = "Delete";
        DialogResult[DialogResult["Cancel"] = 2] = "Cancel";
    })(Calendar.DialogResult || (Calendar.DialogResult = {}));
    var DialogResult = Calendar.DialogResult;
})(Calendar || (Calendar = {}));
var Calendar;
(function (Calendar) {
    var MoveAction = (function () {
        function MoveAction() {
            this._name = "MoveAction";
        }
        MoveAction.prototype.move = function (year, data) {
            var deferred = $.Deferred();
            this.data = data;
            deferred.resolve();
            return deferred.promise();
        };
        return MoveAction;
    })();
    Calendar.MoveAction = MoveAction;
    var PostDataAction = (function () {
        function PostDataAction() {
            this._name = "PostDataAction";
        }
        PostDataAction.prototype.process = function (data) {
            this.data = data;
        };
        return PostDataAction;
    })();
    Calendar.PostDataAction = PostDataAction;
})(Calendar || (Calendar = {}));
var Calendar;
(function (Calendar) {
    var Header = (function () {
        function Header(year) {
            this.year = year;
            this.element = this.render();
        }
        Header.prototype.render = function () {
            return $("<div />").addClass("row calendar-header").append(this.renderHeader());
        };
        Header.prototype.renderHeader = function () {
            return $("<div />").addClass("col-md-12").append($("<div />").addClass("pull-left").append(this.renderButton("prev")).append(this.renderTitle()).append(this.renderButton("next")));
        };
        Header.prototype.renderButton = function (direction) {
            var yearValue = direction === "prev" ? this.year - 1 : this.year + 1, iconClass = direction === "prev" ? "fa fa-chevron-left" : "fa fa-chevron-right";
            return $("<div />").addClass("btn btn-default year-direction").attr("type", "button").attr("name", "year").attr("data-direction", direction).attr("value", yearValue).append($("<span />").addClass(iconClass));
        };
        Header.prototype.renderTitle = function () {
            return $("<div />").addClass("actual-year").attr("data-year", this.year).append($("<strong />").text(this.year));
        };
        return Header;
    })();
    Calendar.Header = Header;
})(Calendar || (Calendar = {}));
var Calendar;
(function (Calendar) {
    var Helpers = (function () {
        function Helpers() {
        }
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
        Helpers.ArrayIndexes = function (indexes) {
            if (indexes.start <= indexes.end) {
                return indexes;
            }
            return {
                start: indexes.end,
                end: indexes.start
            };
        };
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
var Calendar;
(function (Calendar) {
    var MonthCalendar = (function () {
        function MonthCalendar(settings, year) {
            this.today = new Date();
            this.settings = settings;
            this.year = year;
            this.months = moment.months();
            this.weekdays = moment.weekdaysShort();
            var sunday = this.weekdays[0];
            this.weekdays.shift();
            this.weekdays.push(sunday);
            this.capitalize();
            this.element = this.templateCalendar();
        }
        MonthCalendar.prototype.capitalize = function () {
            this.months = this.months.map(function (item) { return Calendar.Helpers.CapitalizeFirstLetter(item); });
            this.weekdays = this.weekdays.map(function (item) { return Calendar.Helpers.CapitalizeFirstLetter(item); });
        };
        MonthCalendar.prototype.templateCalendar = function () {
            var view = $("<div />").addClass("row");
            for (var i = 0, length = this.months.length; i < length; i++) {
                var monthElement = $("<div />").addClass("col-md-3 col-sm-4");
                monthElement.append(this.templateTable(i)).appendTo(view);
            }
            return view;
        };
        MonthCalendar.prototype.templateTable = function (monthId) {
            var actualDate = new Date(this.year, monthId), weekDay = (actualDate.getDay() + 6) % 7, daysInMonth = moment(actualDate).daysInMonth(), displayDay = daysInMonth == 0;
            var table = $("<table />").addClass("calendar-table table-bordered").append($("<thead />").append($("<tr />").addClass("calendar-header-month").append($("<th />").attr("colSpan", 7).text(this.months[monthId]))).append($("<tr />").addClass("calendar-header-day"))).append($("<tbody />").addClass("calendar-body"));
            var dayRow = table.find(".calendar-header-day");
            this.weekdays.forEach(function (item) { return dayRow.append($("<th />").text(item)); });
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
                        if (cellDateIndex === 6 || cellDateIndex === 0) {
                            cell.addClass("weekend");
                        }
                        if (moment(cellDate).format("YYYY-MM-DD") === moment(this.today).format("YYYY-MM-DD")) {
                            cell.addClass("css-today").addClass("today");
                        }
                        cell.attr("data-year-day", moment(cellDate).dayOfYear()).text(index);
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
var Calendar;
(function (Calendar) {
    var Dialog = (function () {
        function Dialog(dialogSettings) {
            this.dialogResult = 2 /* Cancel */;
            this.dialogSettings = dialogSettings;
            this.dialogSettings.selectedEvent = this.dialogSettings.events[0].name;
            this.templateDictionary = this.getDictionary();
        }
        Dialog.prototype.getDictionary = function () {
            var localization = this.dialogSettings.localization;
            return {
                "start": moment(this.dialogSettings.start).format("LL"),
                "end": moment(this.dialogSettings.end).format("LL"),
                "dropdown": Calendar.ModalTemplate.dropdownTemplate(this.dialogSettings),
                "messageSentence": localization.messageSentence,
                "noteSentence": localization.noteSentence,
                "submitButton": localization.submitButton,
                "deleteButton": localization.deleteButton
            };
        };
        Dialog.prototype.show = function () {
            var _this = this;
            var deferred = $.Deferred();
            this.modal = $(Calendar.Helpers.RenderTemplate(Calendar.ModalTemplate.template(), this.templateDictionary)).appendTo($("body"));
            this.modal.modal();
            this.modal.on("click", ".modal-body .dropdown-menu li", function (e) { return _this.selectChange(e); });
            this.modal.on("change", "input", function (e) { return _this.messageChanged(e); });
            this.modal.on("click", ".modal-body .btn-action", function (e) { return _this.click(e); });
            this.modal.on("keyup", function (e) { return _this.modalKeyup(e); });
            this.modal.on("hidden.bs.modal", function () {
                _this.modal.remove();
                deferred.resolve(_this.dialogResult);
            });
            return deferred.promise();
        };
        Dialog.prototype.click = function (e) {
            var action = $(e.target).attr("id");
            this[action](e);
        };
        Dialog.prototype.modalKeyup = function (e) {
            var key = e.keyCode || e.which;
            if (key === 13) {
                this.btnSubmit(e);
            }
            else if (key === 27) {
                this.btnClose(e);
            }
        };
        Dialog.prototype.btnSubmit = function (e) {
            this.dialogResult = 0 /* Submit */;
            this.close();
        };
        Dialog.prototype.btnDelete = function (e) {
            this.dialogResult = 1 /* Delete */;
            this.close();
        };
        Dialog.prototype.btnClose = function (e) {
            this.dialogResult = 2 /* Cancel */;
            this.close();
        };
        Dialog.prototype.close = function () {
            this.modal.modal("hide");
        };
        Dialog.prototype.selectChange = function (e) {
            var li = $(e.target).closest("li");
            this.dialogSettings.selectedEvent = li.attr("data-value");
            var html = li.find("a").html(), faIndex = html.indexOf("<i class"), htmlWithCaret = html.slice(0, faIndex) + " <span class='caret pull-right'></span>" + html.slice(faIndex);
            $(".calendar-modal .dropdown-toggle").html(htmlWithCaret);
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
        return Dialog;
    })();
    Calendar.Dialog = Dialog;
    var ModalTemplate = (function () {
        function ModalTemplate() {
        }
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
                "                   <div>{{messageSentence}}</div>",
                "                   <input type='text' name='userMessage' class='form-control'>",
                "               </div>",
                "               <div class='form-group'>",
                "                   <div>{{noteSentence}}</div>",
                "                   <input type='text' name='privateNote' class='form-control'>",
                "               </div>",
                "           </form>",
                "           <div class='row'>",
                "               <div class='col-md-12'>",
                "                   <button type='button' id='btnDelete' class='btn btn-default pull-left btn-action'>{{deleteButton}}</button>",
                "                   <button type='button' id='btnSubmit' class='btn btn-primary pull-right btn-action'>{{submitButton}}</button>",
                "               </div>",
                "           </div>",
                "       </div>",
                "    </div>",
                "  </div>",
                "</div>"
            ].join("\n");
        };
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
var Calendar;
(function (Calendar) {
    var Popover = (function () {
        function Popover() {
        }
        Popover.popover = function (cell, message, note) {
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
        Popover.destroy = function (cell) {
            cell.popover('destroy');
        };
        Popover.template = function (message, note) {
            var messageTmp = message && message.length ? this.messageTmp.replace("{{message}}", message) : "", noteTmp = note && note.length ? this.noteTmp.replace("{{note}}", note) : "";
            return "<div>" + messageTmp + noteTmp + "</div>";
        };
        Popover.messageTmp = "<div>{{message}}</div>";
        Popover.noteTmp = "<div class='note'>{{note}}</div>";
        return Popover;
    })();
    Calendar.Popover = Popover;
})(Calendar || (Calendar = {}));
var Calendar;
(function (Calendar) {
    var Events = (function () {
        function Events(element, settings) {
            var _this = this;
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
        Events.prototype.setSelectedlYear = function (year) {
            this.year = year;
        };
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
        Events.prototype.mouseup = function (e) {
            e.preventDefault();
            if (!this.indexes.start || !this.indexes.end)
                return;
            var idx = Calendar.Helpers.ArrayIndexes(this.indexes);
            this.dialogSettings.start = moment([this.year]).dayOfYear(idx.start);
            this.dialogSettings.end = moment([this.year]).dayOfYear(idx.end);
            this.showModal();
        };
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
        Events.prototype.removeSelection = function () {
            this.element.find("td").removeClass("selected-day");
            this.resetIndexes();
            this.dialogSettings.personalNote = null;
            this.dialogSettings.message = null;
            this.dialogSettings.selectedEvent = this.settings.events[0].name;
        };
        Events.prototype.submitChanges = function () {
            this.applyEventFormat();
            var data = this.createEventData();
            if (this.settings.submitData.process) {
                this.settings.submitData.process(data);
            }
            else {
                this.settings.submitData.apply(null, data);
            }
        };
        Events.prototype.deleteItems = function () {
            this.removeEventFormat();
            var data = this.createEventData();
            if (this.settings.deleteData.process) {
                this.settings.deleteData.process(data);
            }
            else {
                this.settings.deleteData.apply(null, data);
            }
        };
        Events.prototype.applyEventFormat = function () {
            var _this = this;
            this.indexes = Calendar.Helpers.ArrayIndexes(this.indexes);
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
        Events.prototype.removeEventFormat = function () {
            var eventRange = Calendar.Helpers.ArrayRange(this.indexes.start, this.indexes.end);
            eventRange.forEach(function (item) {
                var cell = $('td.cell[data-year-day=' + item + ']');
                cell.css({ "background-color": "", "color": "" });
                cell.removeAttr("title");
                Calendar.Popover.destroy(cell);
            });
        };
        Events.dataEventFormat = function (data, events, year, showNOte) {
            data.forEach(function (item) {
                var date = moment(item.date);
                if (date.isValid() && date.year() === year) {
                    var listEv = events.filter(function (ev) { return ev.name.toLocaleLowerCase() === item.event.toLocaleLowerCase(); }), currentEvent = listEv.length ? listEv[0] : events[0], yearDay = date.dayOfYear(), cell = $('td.cell[data-year-day=' + yearDay + ']');
                    cell.addClass('event-day');
                    cell.css({ "background-color": currentEvent.backgroundColor, "color": currentEvent.color });
                    if (item.message || item.note) {
                        Calendar.Popover.popover(cell, item.message, showNOte ? item.note : null);
                    }
                }
            });
        };
        Events.prototype.leftMousePressed = function (e) {
            var event = window.event;
            var button = e.which || event.button;
            return button === 1;
        };
        Events.prototype.resetIndexes = function () {
            this.indexes = { start: null, end: null };
        };
        Events.prototype.createEventData = function () {
            var _this = this;
            var data = [];
            var eventRange = Calendar.Helpers.ArrayRange(this.indexes.start, this.indexes.end), event = this.dialogSettings.selectedEvent, message = this.dialogSettings.message, note = this.dialogSettings.personalNote;
            eventRange.forEach(function (element) {
                var date = moment([_this.year]).dayOfYear(element);
                data.push({
                    date: date.toDate(),
                    event: event,
                    message: message,
                    note: note
                });
            });
            return data;
        };
        return Events;
    })();
    Calendar.Events = Events;
})(Calendar || (Calendar = {}));
var Calendar;
(function (Calendar) {
    var EventCalendar = (function () {
        function EventCalendar(element, options) {
            var _this = this;
            this.element = element;
            this.year = new Date().getFullYear();
            this.settings = $.extend(true, this.defaultSettings(), options);
            if (this.settings.locale) {
                moment.locale(this.settings.locale);
            }
            this.moveAction = this.settings.moveAction;
            this.events = new Calendar.Events(this.element, this.settings);
            this.events.setSelectedlYear(this.year);
            this.element.on("click", ".year-direction", function (e) { return _this.changeYear(e); });
        }
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
                moveAction: new Calendar.MoveAction(),
                submitData: new Calendar.PostDataAction(),
                deleteData: new Calendar.PostDataAction()
            };
        };
        EventCalendar.prototype.setEventFormat = function () {
            if (this.settings.data) {
                Calendar.Events.dataEventFormat(this.settings.data, this.settings.events, this.year, this.settings.editable);
            }
        };
        EventCalendar.prototype.init = function () {
            this.element.empty();
            var header = new Calendar.Header(this.year), monthTables = new Calendar.MonthCalendar(this.settings, this.year);
            var wrapper = $("<div />").addClass("calendar-wrapper").append(header.element).append(monthTables.element);
            wrapper.appendTo(this.element);
            this.setEventFormat();
        };
        EventCalendar.prototype.destroy = function () {
            this.element.removeData("jquery.event.calendar");
            this.element.off();
            this.element.unbind();
            this.element.empty();
        };
        EventCalendar.prototype.changeYear = function (e) {
            var _this = this;
            var direction = $(e.target).closest(".year-direction").attr("data-direction");
            this.year = direction === "prev" ? this.year - 1 : this.year + 1;
            if (this.moveAction.move) {
                this.moveAction.move(this.year, this.settings.data).always(function () { return _this.setSelectedYear(); });
            }
            else {
                $.when(this.moveAction.call(null, this.year)).done(function (result) {
                    _this.setSelectedYear(result);
                }).fail(function () {
                    _this.setSelectedYear();
                });
            }
        };
        EventCalendar.prototype.setSelectedYear = function (newData) {
            this.settings.data = newData ? newData : this.moveAction.data;
            this.init();
            this.events.setSelectedlYear(this.year);
            this.setEventFormat();
        };
        return EventCalendar;
    })();
    Calendar.EventCalendar = EventCalendar;
})(Calendar || (Calendar = {}));
(function ($) {
    $.fn.eventCalendar = function () {
        var option = arguments[0], args = arguments;
        return this.each(function () {
            var $this = $(this), data = $this.data("jquery.event.calendar"), options = $.extend({}, $.fn.eventCalendar.defaults, $this.data(), typeof option === 'object' && option);
            if (!data) {
                $this.data("jquery.event.calendar", (data = new Calendar.EventCalendar($this, options)));
            }
            if (typeof option === 'string') {
                data[option](args[1]);
            }
            else {
                data.init();
            }
            $.fn.eventCalendar.destroy = function () {
                data.destroy();
            };
        });
    };
    $.fn.eventCalendar.defaults = {};
})(jQuery);
