///<reference path="../typing/jquery.d.ts" />

module Calendar {

    /**
     * Renders header of plugin. Contains actual year and navigation
     * to previous and next year.
     *
     * @class Header
     * @constructor
     * @param {number} year - Selected year
     */
    export class Header {
        /**
         * jQuery element.
         *
         * @property element
         * @type {JQuery}
         */
        element: JQuery;

        /**
         * Selected year.
         *
         * @property year
         * @type {number}
         */
        year: number;

        constructor(year: number){
            this.year = year;
            this.element = this.render();
        }

        /**
         * Creates whole header elements.
         *
         * @method render
         * @return JQuery - Calendar header wrapper
         */
        render(): JQuery {
            return $("<div />")
                        .addClass("row calendar-header")
                        .append(this.renderHeader());
        }

        /**
         * Creates main header element and appends navigation buttons
         * and title.
         *
         * @method renderHeader
         * @return JQuery - Calendar header with selected year and navigation buttons
         */
        renderHeader(): JQuery {
            return $("<div />")
                        .addClass("col-md-12")
                        .append($("<div />")
                            .append(this.renderButton("prev"))
                            .append(this.renderTitle())
                            .append(this.renderButton("next")));
        }

        /**
         * Creates navigation button.
         *
         * @method renderButton
         * @param {string} direction - Direction (prev or next)
         * @return JQuery - Navigation button
         */
        renderButton(direction: string): JQuery {
            var yearValue = direction === "prev" ? this.year - 1 : this.year + 1,
                previousElement: JQuery = $("<span>&laquo;</span>"),
                nextElement: JQuery = $("<span>&raquo;</span>");

            return $("<div />")
                        .addClass("btn btn-link year-direction")
                        .attr("name", "year")
                        .attr("data-direction", direction)
                        .attr("value", yearValue)
                        .append($("<span />")
                            .addClass("direction-sign")
                            .append(direction === "prev" ? previousElement : nextElement));
        }

        /**
         * Creates year title.
         *
         * @method renderTitle
         * @return JQuery - Title (selected year)
         */
        renderTitle(): JQuery {
            return $("<div />")
                        .addClass("actual-year")
                        .attr("data-year", this.year)
                        .append($("<strong />")
                            .text(this.year));
        }
    }
}