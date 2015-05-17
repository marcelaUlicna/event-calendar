///<reference path="../typing/jquery.d.ts" />
///<reference path="common.ts" />

module Calendar {

    /**
     * Base class for implementation of changing year by
     * clicking on "previous" or "next" arrow. Implements
     * `IMoveAction` interface and can be overwritten.
     *
     * __Example__ of implementation user's class with `next()` and `previous()` methods.
     * Server returns new data for each year:
     *
     *     export class MyMoveAction extends MoveAction {
     *       next(year: number, data?: Array<IData>): JQueryPromise<any> {
     *           var deferred = $.Deferred();
     *           this.getJsonData(year, deferred);
     *           return deferred.promise();
     *       }
     *
     *       previous(year: number, data?: Array<IData>): JQueryPromise<any> {
     *           var deferred = $.Deferred();
     *           this.getJsonData(year, deferred);
     *           return deferred.promise();
     *       }
     *
     *       private getJsonData(year: number, deferred: JQueryDeferred<any>): void {
     *           var url = "data/events" + year + ".json";
     *           $.ajax(url)
     *               .done((result) => {
     *                   this.data = result;
     *               })
     *               .always(() => {
     *                   deferred.resolve();
     *               });
     *       }
     *     }
     *
     * @class MoveAction
     * @implements IMoveAction
     */
    export class MoveAction implements IMoveAction {
        data: Array<IData>;

        /**
         * Gets data for next year.
         *
         * @method next
         * @param {number} year - Selected year
         * @param {Array<IData>} [data] - Data from settings
         * @return {JQueryPromise<any>} - jQuery promise
         */
        next(year: number, data?: Array<IData>): JQueryPromise<any> {
            var deferred = $.Deferred();
            this.data = data;
            deferred.resolve();
            return deferred.promise();
        }

        /**
         * Gets data for previous year.
         *
         * @method previous
         * @param {number} year - Selected year
         * @param {Array<IData>} [data] - Data from settings
         * @return {JQueryPromise<any>} - jQuery promise
         */
        previous(year: number, data?: Array<IData>): JQueryPromise<any> {
            var deferred = $.Deferred();
            this.data = data;
            deferred.resolve();
            return deferred.promise();
        }

    }
}