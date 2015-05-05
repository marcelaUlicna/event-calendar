/**
 * Created by Marcela on 5. 5. 2015.
 */

///<reference path="../typing/jquery.d.ts" />
///<reference path="../typing/bootstrap.d.ts" />
///<reference path="../typing/moment.d.ts" />
///<reference path="common.ts" />
///<reference path="helpers" />

module Calendar {

    export class Dialog {

        dialogSettings: IModalDialog;
        templateDictionary: { [key: string]: any };
        modal: JQuery;

        dialogResult: DialogResult = DialogResult.Cancel;

        constructor(dialogSettings:IModalDialog) {
            this.dialogSettings = dialogSettings;
            this.templateDictionary = this.getDictionary();
        }

        private getDictionary(): any {
            return {
                "title": "Modal title",
                "start": moment(this.dialogSettings.start).format("LL"),
                "end":  moment(this.dialogSettings.end).format("LL"),
                "options": this.optionTemplate()
            };
        }

        show(): JQueryPromise<DialogResult> {
            var deferred = $.Deferred<DialogResult>();

            this.modal = $(Calendar.Helpers.RenderTemplate(this.template, this.templateDictionary)).appendTo($("body"));
            this.modal.modal();

            this.modal.on("change", "select.select-event", (e) => this.selectChange(e));
            this.modal.on("change", "input", (e) => this.messageChanged(e));
            this.modal.on("click", ".modal-footer button", (e) => this.click(e));
            this.modal.on("hidden.bs.modal", () => {
                    this.modal.remove();
                    deferred.resolve(this.dialogResult);
                }
            );
            return deferred.promise();
        }

        click(e: JQueryEventObject): void {
            var action = $(e.target).attr("id");
            this[action](e);
            this.close();
        }

        btnSubmit(e: JQueryEventObject): void {
            this.dialogResult = DialogResult.Submit;
        }

        btnReset(e: JQueryEventObject): void {
            this.dialogResult = DialogResult.Reset;
        }

        btnClose(e: JQueryEventObject): void {
            this.dialogResult = DialogResult.Cancel;
        }

        close(): void {
            this.modal.modal("hide");
        }

        selectChange(e: JQueryEventObject) {
            this.dialogSettings.selectedEvent = this.modal
                .find("select.select-event option:selected")
                .first()
                .attr("value");
        }

        messageChanged(e:JQueryEventObject): void {
            var input = $(e.target);

            if(input.attr("name") === "userMessage") {
                this.dialogSettings.message = input.val();
            } else {
                this.dialogSettings.personalNote = input.val();
            }
        }

        private template: string = [
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

        private optionTemplate(): string {
            var template: string = "<option value='{{value}}' style='background-color: {{color}};'>{{value}}</option>";

            var options = this.dialogSettings.events.map((item) => {
                return Calendar.Helpers.RenderTemplate(template, {"value": item.name, "color": item.color});
            });

            return options.join("");
        }
    }
}