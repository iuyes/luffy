//base
define(function (require, exports, module) {
    var Base = require('arale/base/1.1.1/base');
    var $ = require('$');
    var Panel = Base.extend({
        attrs: {
            element: {
                value: '#demo',
            },
            color: '#eee',
            size: {
                width: 100,
                height: 100
            },
            x: 200,
            y: 200,
            xy: {
                setter: function (val) {
                    this.set('x', val[0]);
                    this.set('y', val[1]);
                },
                getter: function () {
                    return this.get('x') + this.get('y');
                }
            }
        },
//        .实例化
        initialize: function (config) {
            Panel.superclass.initialize.call(this, config);
            this.element = $(config.element).eq(0);
            this.element.css({backgroundColor: this.get('color'), width: this.get('size').width, height: this.get('size').height});
            this.element.css({marginTop: this.get('y'), marginLeft: this.get('x')});
        },
        _onChangeColor: function (val) {
            console.log('只在set时调用');
            this.element.css('backgroundColor', val);
        },
        _onChangeX: function (val) {
            this.element.css('marginTop', val);
        }
    });

    module.exports = Panel;

})
;