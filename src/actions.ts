///<reference path="../typing/jquery.d.ts" />
///<reference path="common.ts" />

module Calendar {

    /**
     * Base class for implementation of changing year by
     * clicking on "previous" or "next" arrow. Implements
     * `IMoveAction` interface and can be overwritten.
     *
     * __Example__ of implementation user's class with `move()` method.
     * Server returns new data for each year:
     *
     *     export class MyMoveAction extends MoveAction {
     *       move(year: number, data?: Array<IData>): JQueryPromise<any> {
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
        private _name: string = "MoveAction";
        
        /**
         * @property data
         * @type {Array<IData>}
         */
        data: Array<IData>;
        
         /**
         * Gets data for new year.
         *
         * @method move
         * @param {number} year - Selected year
         * @param {Array<IData>} [data] - Data from settings
         * @return {JQueryPromise<any>} - jQuery promise
         */
        move(year: number, data?: Array<IData>): JQueryPromise<any> {
            var deferred = $.Deferred();
            this.data = data;
            deferred.resolve();
            return deferred.promise();
        }
    }
    
    /**
     * Base class for implementation of submiting and deleting
     * data. Implements `ICalendarAction` interface and
     * can be overwritten. Contains one method `process(data: Array<IData>)`
     * whose parameter has array of IData objects that can be
     * sent to server (save or delete method).
     * 
     * @class PostDataAction
     * @implements ICalendarAction
     */
    export class PostDataAction implements ICalendarAction {
        private _name: string = "PostDataAction";
        
        /**
         * @property data
         * @type {Array<IData>}
         */
        data: Array<IData>;
        
        /**
         * Privides submiting or deleting functionality.
         * 
         * @method process
         * @param {Array<IData>} data - Range of selected objects
         */
        process(data: Array<IData>): void {
            this.data = data;
        }
    }
}