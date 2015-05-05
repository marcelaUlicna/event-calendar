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
//# sourceMappingURL=modal.js.map