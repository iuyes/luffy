define(function (require, exports, module) {
    var Widget = require('widget');
    var $ = require('$');
    var Tab = Widget.extend({
        attrs: {
            a: {
                value: 1,
                getter: function (val) {
                    return val;
                },
                setter:function(val){
                    return val+10;
                }
            }
        },
        _onRenderA: function () {
            console.log(this.get('a'));
        }
    });

    module.exports = Tab;

});