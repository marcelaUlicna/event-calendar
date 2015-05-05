/**
 * Created by Marcela on 28. 4. 2015.
 */

///<reference path="../typing/jquery.d.ts" />
///<reference path="common.ts" />

module Calendar {

    /**
     * This provides various helpers.
     *
     * @class Helpers
     */
    export class Helpers {

        /**
         * Utility that creates new array according to specified values (`from` and `to`).
         * If there is the specified input array, the result will contain elements
         * from this array, otherwise there will be a sequence of integers in the range
         * of each of the given values.
         *
         * This is an __example__ of usage `ArrayRange` method
         *
         *     var array = [1,2,4,5,6,8,9,21,22,45],
         *         from = 2,
         *         to = 10;
         *
         *     Calendar.Helpers.ArrayRange(2,10,array);
         *     // => [2, 4, 5, 6, 8, 9]
         *
         *     // example of unsorted array
         *     Calendar.Helpers.ArrayRange(2,10,1,6,2,5,6,7,4,5]);
         *     // => [2, 4, 5, 6, 7]
         *
         *     // example without input array
         *     Calendar.Helpers.ArrayRange(2,10);
         *     // => [2, 3, 4, 5, 6, 7, 8, 9, 10]
         *
         *
         * @method ArrayRange
         * @static
         * @param {number} from - Start value
         * @param {number} to - End value
         * @param {Array<number>} [array] - Input array
         *
         * @return {Array<number>}
        */
        static ArrayRange(from: number, to: number, array?: Array<number>): Array<number> {
            var A = [],
                step = 1;

            if (Object.prototype.toString.call(array) === '[object Array]') {
                while (from <= to) {
                    if (!!~array.indexOf(from)) {
                        A.push(from);
                    }
                    from += step;
                }
            } else {
                while (from <= to) {
                    A.push(from);
                    from += step;
                }
            }
            return A;
        }

        /**
         * Provides the correct order of start and end indexes
         *
         * @method ArrayIndexes
         * @static
         * @param {IArrayIndexes} indexes - Object with start and end value
         * @return {IArrayIndexes}
         */
        static ArrayIndexes(indexes: IArrayIndexes): IArrayIndexes {
            if(indexes.start <= indexes.end) {
                return indexes;
            }
            return {
                start: indexes.end,
                end: indexes.start
            }
        }

        /**
         * Capitalizes the first letter of the text.
         *
         * @method CapitalizeFirstLetter
         * @static
         * @param {string} text - Text
         * @return {string}
         */
        static CapitalizeFirstLetter(text: string): string {
            return text.charAt(0).toUpperCase() + text.slice(1);
        }

        static RenderTemplate(template: string, dict: { [key: string]: any }): string {
            return template.replace(/\{\{(.*?)\}\}/g, function (match: string, key?: string): string {
                var value: any = dict,
                    keys: string[] = key.split(".");

                for (var i: number = 0, length: number = keys.length; i < length; i++) {
                    if (typeof value === "undefined" || value === null) {
                        break;
                    }
                    value = value[keys[i]];
                }

                return typeof value === "undefined" ? "" : value;
            });
        }
    }
}