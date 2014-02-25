define('play/class/1.0.0/pig', ["arale/class/1.1.0/class"], function (require, exports, module) {
    var Class = require('arale/class/1.1.0/class');
    var Pig = Class.create({
        initialize: function (name) {
            this.name = name;
        },
        echoname: function () {
            alert('我是' + this.name);
        }
    });
    module.exports = Pig;
});


define('play/class/1.0.0/flyredpig', ["./pig"], function (require, exports, module) {
    var Flyable = require('./flyable');
    var Redpig = require('./redpig');
    var Flyredpig = Redpig.extend({
        initialize: function (name) {
            Flyredpig.superclass.initialize.call(this, name);
        },
        Implements: Flyable
    });
    module.exports = Flyredpig;
});


define('play/class/1.0.0/flyable', [], function (require, exports, module) {
    exports.flyable = function () {
        alert('i can fly - -!');
    }
});

define('play/class/1.0.0/redpig', [], function (require, exports, module) {
    var Pig = require('./pig');
    var Redpig = Pig.extend({
        initialize: function (name) {
            Redpig.superclass.initialize.call(this, name);
        },
        color: '红色'
    });
    module.exports = Redpig;
});