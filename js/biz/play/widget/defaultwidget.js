define('playman/widget/1.0.0/defaultwidget', ["./defaultwidget.tpl", "./defaultwidget.css", "./defaultwidget.json","play/widget/temwidget"], function (require, exports, module) {
    var Temwidget = require('play/widget/temwidget');
    require('./defaultwidget.css');
    var Defaultwidget = Temwidget.extend({
        attrs: {
            model: require('./defaultwidget.json'),
            template: require('./defaultwidget.tpl')
        },
        events: {
            'click h2': function () {
                this.element.find('.content').slideToggle('slow');
            }
        },
        setup: function () {
            this.$(".content").css('background-color', '#eee');
        }
    });
    module.exports = Defaultwidget;

});

//组件默认的模版dom
define('playman/widget/1.0.0/defaultwidget.tpl', [], '<div class="example5"><h2>{{title}}</h2><div class="content">{{content}}</div></div>');

//组件默认的模版样式
define("playman/widget/1.0.0/defaultwidget.css", [], function () {
    seajs.importStyle(".example5{width:300px;height:300px;border:1px solid #eeeeee;margin-top:10px}.example5 h2{height:30px;background-color:#FFE5CA}.example5 content{padding:20px;font-size:16px}");
});

//组件默认的数据
define('playman/widget/1.0.0/defaultwidget.json', [], {
        "title": "这是标题",
        "content": "这是内容"
    }
);