define(function (require, exports, module) {
  var Widget = require('arale/widget/1.1.1/widget');
  var $ = require('$');
  var Tabview = Widget.extend({
    attrs: {
      triggers: {
        value: '.nav li',
        getter: function (val) {
          return this.$(val);
        },
        readOnly: true
      },
      panels: {
        value: '.content div',
        getter: function (val) {
          return this.$(val);
        },
        readOnly: true
      },
      activeIndex: {
        value: 0
      }
    },
    events: {
      'click .nav li': '_switchEventHandeler'
    },
    _onRenderActiveIndex: function (val, prev) {
      this.get('panels').eq(val).show();
      this.get('panels').eq(prev).hide();
      this.get('triggers').eq(val).addClass('active');
      this.get('triggers').eq(prev).removeClass('active');
    },
    _switchEventHandeler: function (ev) {
//              console.log(ev.target); //目标dom
      var index = this.get('triggers').index(ev.target);
      this.switchTo(index);
    },
    switchTo: function (index) {
      this.set('activeIndex', index);
    },
    setup: function () {
      this.get('panels').hide();
      this.switchTo(this.get('activeIndex'));
    },
    add: function (title, content) {
      var li = $('<li class="">' + title + '</li>');
      var div = $('<div>' + content + '</div>');

      li.appendTo(this.get('triggers')[0].parentNode);
      div.appendTo(this.get('panels')[0].parentNode);
      return this;
    },
    setActiveContent: function (content) {
      this.get('panels').eq(this.get('activeIndex')).html(content);
    },
    size: function () {
      return this.get('triggers').length
    },
    setActiveIndex: function (index) {
      this.switchTo(index);
    }
  });

  module.exports = Tabview;

});