/**
 * Created with JetBrains PhpStorm.
 * User: playman.me
 * Date: 13-9-25
 * Time: 上午11:20
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
    var Widget = require('widget');
    var Templatable = require('templatable');
    var Temwidget = Widget.extend({
        Implements: Templatable
    });
    module.exports = Temwidget;
});
