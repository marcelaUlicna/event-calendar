/**
 * Created by Marcela on 17. 5. 2015.
 */

///<reference path="../typing/jquery.d.ts" />
///<reference path="../src/actions.ts" />

module Calendar {
    export class MyMoveAction extends MoveAction {
        move(year: number, data?: Array<IData>): JQueryPromise<any> {
            var deferred = $.Deferred();
            this.getJsonData(year, deferred);
            return deferred.promise();
        }

        getJsonData(year: number, deferred: JQueryDeferred<any>): void {
            var url = "data/events" + year + ".json";
            $.ajax(url)
                .done((result) => {
                    this.data = result;
                })
                .always(() => {
                    deferred.resolve();
                });
          }
    }
}