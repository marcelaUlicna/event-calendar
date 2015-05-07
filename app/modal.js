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
                "       <div class='modal-header'  style='border-bottom: none;'>",
                "           <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>",
                "       </div>",
                "       <div class='modal-body' style='padding-top: 0;'>",
                "           <div class='row' style='padding-bottom: 15px;'>",
                "               <div class='col-md-12'>{{start}}</div>",
                "               <div class='col-md-12'>{{end}}</div>",
                "           </div>",
                "           <div class='row' style='padding-bottom: 15px;'>",
                "               <div class='col-md-12'><select class='select-event form-control'>{{options}}</select></div>",
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
                "                   <button type='button' id='btnDelete' class='btn btn-default pull-left'>Delete</button>",
                "                   <button type='button' id='btnSubmit' class='btn btn-primary pull-right'>Submit</button>",
                "               </div>",
                "           </div>",
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
            this.modal.on("click", ".modal-body button", function (e) { return _this.click(e); });
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
        Dialog.prototype.btnDelete = function (e) {
            this.dialogResult = 1 /* Delete */;
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
            var template = "<option value='{{value}}' style='background-color: {{backgroundColor}}; color: {{color}}'>{{value}}</option>";
            var options = this.dialogSettings.events.map(function (item) {
                return Calendar.Helpers.RenderTemplate(template, {
                    "value": item.name,
                    "backgroundColor": item.backgroundColor != null ? item.backgroundColor : "green",
                    "color": item.color != null ? item.color : "white"
                });
            });
            return options.join("");
        };
        return Dialog;
    })();
    Calendar.Dialog = Dialog;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=modal.js.map