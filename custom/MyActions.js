/**
 * Created by Marcela on 17. 5. 2015.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="../typing/jquery.d.ts" />
///<reference path="../src/actions.ts" />
var Calendar;
(function (Calendar) {
    var MyMoveAction = (function (_super) {
        __extends(MyMoveAction, _super);
        function MyMoveAction() {
            _super.apply(this, arguments);
        }
        MyMoveAction.prototype.next = function (year, data) {
            var deferred = $.Deferred();
            this.getJsonData(year, deferred);
            return deferred.promise();
        };
        MyMoveAction.prototype.previous = function (year, data) {
            var deferred = $.Deferred();
            this.getJsonData(year, deferred);
            return deferred.promise();
        };
        MyMoveAction.prototype.getJsonData = function (year, deferred) {
            var _this = this;
            var url = "data/events" + year + ".json";
            $.ajax(url).done(function (result) {
                _this.data = result;
            }).always(function () {
                deferred.resolve();
            });
        };
        return MyMoveAction;
    })(Calendar.MoveAction);
    Calendar.MyMoveAction = MyMoveAction;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=MyActions.js.map