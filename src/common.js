///<reference path="../typing/jquery.d.ts" />
var Calendar;
(function (Calendar) {
    (function (DialogResult) {
        DialogResult[DialogResult["Submit"] = 0] = "Submit";
        DialogResult[DialogResult["Delete"] = 1] = "Delete";
        DialogResult[DialogResult["Cancel"] = 2] = "Cancel";
    })(Calendar.DialogResult || (Calendar.DialogResult = {}));
    var DialogResult = Calendar.DialogResult;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=common.js.map