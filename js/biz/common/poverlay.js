/**
 * Created by huijun on 13-11-2.
 * 此模块继承于arale/overlay,可以在点击空白处后隐藏此悬浮层
 */
define(function (require, exports, module) {
    var Overlay = require('arale/overlay/1.1.3/overlay');
    var Poverlay = Overlay.extend({
        setup: function () {
            Poverlay.superclass.setup.call(this);
            this._blurHide([this.element]);
        }
    });

    module.exports = Poverlay;
});