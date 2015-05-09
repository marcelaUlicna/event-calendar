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
//# sourceMappingURL=popover.js.map