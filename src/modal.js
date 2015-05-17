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
            /**
             * Dialog result from modal action.
             *
             * @property dialogResult
             * @type {DialogResult}
             * @default "DialogResult.Cancel"
             * */
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
            this.modal.on("keyup", function (e) { return _this.modalKeyup(e); });
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
        };
        /**
         * jQuery keyup() event for enter and escape key.
         * Enter key confirms dialog and escape key closes dialog
         * without changes.
         *
         * @method modalKeyup
         * @param {JQueryEventObject} e - Key event handler
         * */
        Dialog.prototype.modalKeyup = function (e) {
            var key = e.keyCode || e.which;
            if (key === 13) {
                this.btnSubmit(e);
            }
            else if (key === 27) {
                this.btnClose(e);
            }
        };
        /**
         * Sets dialogResult to `DialogResult.Submit`.
         *
         * @method btnSubmit
         * @param {JQueryEventObject} e - Button object handler
         */
        Dialog.prototype.btnSubmit = function (e) {
            this.dialogResult = 0 /* Submit */;
            this.close();
        };
        /**
         * Sets dialogResult to `DialogResult.Delete`.
         *
         * @method btnDelete
         * @param {JQueryEventObject} e - Button object handler
         */
        Dialog.prototype.btnDelete = function (e) {
            this.dialogResult = 1 /* Delete */;
            this.close();
        };
        /**
         * Sets dialogResult to `DialogResult.Cancel`.
         *
         * @method btnClose
         * @param {JQueryEventObject} e - Button object handler
         */
        Dialog.prototype.btnClose = function (e) {
            this.dialogResult = 2 /* Cancel */;
            this.close();
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
//# sourceMappingURL=modal.js.map