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
//# sourceMappingURL=header.js.map