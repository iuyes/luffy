define(function (require, exports, module) {
    var Widget = require('arale/widget/1.1.1/widget');
    var WidgetA = Widget.extend({
        attrs: {
            a: 1
        },
        events: {
            'click h3': 'sethead',
            'click p': 'setp'
        },
        sethead: function () {
            this.element.find('h3').html('我都不知道该说啥了，您太牛逼了');
        },
        setp: function () {
            console.log(this.getcolor());
            this.element.find('p').css('background-color', this.getcolor());
        },
        _onRenderA: function (val) {
            console.log(val);
        },
        //随机颜色
        getcolor: function () {
            var color = "#";
            for (var i = 1; i <= 6; i++) {
                color += Math.round(Math.random() * 9);
            }
            return color;
        }
    });

    module.exports = WidgetA;
});