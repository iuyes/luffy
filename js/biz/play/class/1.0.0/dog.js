// class将构造函数变成类
define(function (require, exports, module) {
    function Aniamal() {
    }
    Aniamal.prototype.echoname = function () {
        alert('我是动物');
    }
    var Class = require('arale/class/1.1.0/class');
    var Dog = Class(Aniamal).extend({
        swim: function () {
            alert('我是会游泳的狗');
        }
    });
    module.exports = Dog;
});


