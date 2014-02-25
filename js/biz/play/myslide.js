/**
 * Created by huijun.wenghj on 13-12-20.
 */
define(function (require, exports, module) {
  var $ = require('$');
  var Widget = require('arale/widget/1.1.1/widget');
  var mySlide = Widget.extend({
    attrs: {
      element: '.slide',
      triggers: {
        value: '.slide-triggers>li',
        getter: function (val) {
          return this.$(val);
        }
      },
      panels: {
        value: '.slide-panels>li',
        getter: function (val) {
          return this.$(val);
        }
      },
      activeIndex: {
        value: 0
      },
      prevBtn: {
        value: '.prevBtn',
        getter: function (val) {
          return this.$(val);
        }
      },
      nextBtn: {
        value: '.nextBtn',
        getter: function (val) {
          return this.$(val);
        }
      },
      triggerType: 'click',
      activeTriggerClass: 'active',
      autoplay: true,
      hasTriggers: true,
      circular: true,  //是否循环播放
      deply: 100,  //延迟时间ms
      interval: {      //自动播放时间间隔m
        value: 5,
        getter: function (val) {
          return val * 1000;
        }
      }
    },
    _onRenderActiveIndex: function (toIndex, fromIndex) {
      this.get('triggers').eq(fromIndex).removeClass(this.get('activeTriggerClass'));
      this.get('triggers').eq(toIndex).addClass(this.get('activeTriggerClass'));
      this.get('panels').eq(fromIndex).hide();
      this.get('panels').eq(toIndex).show();
    },
    _switchToEventHandler: function (e) {
      this.switchTo(this.get('triggers').index(e.target || e.srcElement));
    },
    switchTo: function (toIndex) {
      this.set('activeIndex', toIndex);
    },
    size: function () {
      return this.get('triggers').length;
    },
    next: function () {
      var fromIndex = this.get('activeIndex');
      var toIndex = ++fromIndex;
      if (this.get('circual')) {
        if (toIndex == this.size()) {
          this.switchTo(0);
        } else {
          this.switchTo(toIndex);
        }
      } else {
        if (toIndex == 1) {
          this.get('prevBtn').css('display', 'block');
          this.switchTo(toIndex);
        }
        else if (toIndex == this.size() - 1) {
          this.get('nextBtn').css('display', 'none');
          this.switchTo(toIndex);
        }
        else if (toIndex == this.size()) {
          return false;
        }
        else {
          this.switchTo(toIndex);
        }
      }
    },
    prev: function () {
      var formIndex = this.get('activeIndex');
      var toIndex = --formIndex;
      if (this.get('circular')) {
        if (toIndex == -1) {
          this.switchTo(this.size() - 1);
        } else {
          this.switchTo(toIndex);
        }
      } else {
        if (toIndex == this.size() - 2) {
          this.get('nextBtn').css('display', 'block');
          this.switchTo(toIndex);
        }
        else if (toIndex == 0) {
          this.get('prevBtn').css('display', 'none');
          this.switchTo(toIndex);
        }
        else if (toIndex == -1) {
          return false;
        }
        else {
          this.switchTo(toIndex);
        }
      }
    },
    _initSwitchable: function () {
      if (!this.get('hasTriggers')) {
        this.get('prevBtn').css('display', 'none');
        this.get('nextBtn').css('display', 'none');
      }
      this.set('activeIndex', 0);
      var _self = this;
      if (this.get('autoplay')) {
        setInterval(function () {
          _self.next();
        }, _self.get('interval'));
      }
    },
    _initTriggers: function () {
      var that = this;
      var triggers = this.get('triggers');
      if (this.get('triggerType') === 'click') {
        triggers.click(focus);
      } else {
        triggers.hover(focus, leave);
      }
      function focus(e) {
        if (e.type == 'click') {
          this.switchTo(this.get('triggers').index(e.target));
        } else {
          this._switchTimer = setTimeout(function () {
            that.switchTo(that.get('triggers').index(e.target));
          }, that.get('deply'));
        }
        this.switchTo(this.get('triggers').index(e.target));
      }

      function leave() {
        clearTimeout(this._switchTimer);
      }
    },
    setup: function () {
      this._initSwitchable();
      this._bindTriggers();
    }

  });
  module.exports = mySlide;
});
