//使用implement对已存在的Flyredpig类动态修改 .添加swim的功能
define(function (require, exports, module) {
    var Flyredpig = require('play/class/1.0.0/flyredpig');
    Flyredpig.implement({
        swim: function () {
            alert('我还会游泳');
        }
    });
});