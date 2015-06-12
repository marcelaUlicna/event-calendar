///<reference path="../typing/jquery.d.ts" />
///<reference path="../src/actions.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Calendar;
(function (Calendar) {
    var MySubmitMethod = (function (_super) {
        __extends(MySubmitMethod, _super);
        function MySubmitMethod() {
            _super.apply(this, arguments);
        }
        MySubmitMethod.prototype.process = function (data) {
            this.data = data;
            console.log('MySubmitMethod', data);
        };
        return MySubmitMethod;
    })(Calendar.PostDataAction);
    Calendar.MySubmitMethod = MySubmitMethod;
    var MyDeleteMethod = (function (_super) {
        __extends(MyDeleteMethod, _super);
        function MyDeleteMethod() {
            _super.apply(this, arguments);
        }
        MyDeleteMethod.prototype.process = function (data) {
            this.data = data;
            console.log('MyDeleteMethod', data);
        };
        return MyDeleteMethod;
    })(Calendar.PostDataAction);
    Calendar.MyDeleteMethod = MyDeleteMethod;
})(Calendar || (Calendar = {}));
