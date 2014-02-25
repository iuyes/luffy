define(function (require, exports, module) {
    var Temwidget = require('playman/widget/1.0.0/temwidget');
    var Handlebars = require('gallery/handlebars/1.0.2/handlebars');
    var $ = require('$');
    var WidgetHelper = Temwidget.extend({
        events: {
            'click li .remove': function (event) {
                event.preventDefault();
                $(event.target).parent().remove();
            },
            'click h3': function () {
                this.$('ul').slideToggle('slow');
            },
            'mouseenter ul': function () {
                this.$('ul').css('backgroundColor', '#eee');
            },
            'mouseleave ul': function () {
                this.$('ul').css('backgroundColor', '');
            }
        },
        templateHelpers: {
            'list': function (items) {
                var out = '';

                for (var i = 0, len = items.length; i < len; i++) {
                    var item = items[i];
                    out += '<li>' + item.text +
                        '<a href="#" class="remove">X</a></li>';
                }
                return new Handlebars.SafeString(out);
            }
        }
    });
    module.exports = WidgetHelper;
});