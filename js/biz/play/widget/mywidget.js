define(function (require, exports, module) {
    var Widget = require('arale/widget/1.1.1/widget');
    var Mywidget = Widget.extend({
        attrs: {
            a: 1
        },
        initAttrs: function (config) {
            console.log('这是在initattrs前处理');
            Mywidget.superclass.initAttrs.call(this, config);
            console.log('这是在initattrs后处理');
        },
        _onRenderA:function(val){
            console.log('a的值又变了'+val);//会在render时和.set()时调用
        }
    });
    module.exports = Mywidget;


});