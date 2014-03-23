/**
 * Created with JetBrains PhpStorm.
 * User: huijun
 * Date: 13-8-9
 * Time: 下午4:59
 * To change this template use File | Settings | File Templates.
 */

;(function () {
  if ((typeof document.createElement('canvas').getContext) === 'undefined') {
    var e = "abbr, article, aside, audio, canvas, datalist, details, dialog, eventsource, figure, footer, header, hgroup, m, mark, menu, meter, nav, output, progress, section, time, video".split(', ');
    var i = e.length;
    while (i--) {
      document.createElement(e[i]);
    }
  }
}());


var baseURL = location.protocol === 'https' ? 'https://whj.com/js/' : 'http://whj.com/js/';
seajs.config({
  base: baseURL,
  alias: {
    // ====seajs====
    'seajs-text': 'luffy/seajs-text/1.0.2/seajs-text',
    'seajs-debug': 'luffy/seajs-debug/1.0.0/seajs-debug',      //seajs debug 工具
    'seajs-flush': 'luffy/seajs-flush/1.0.1/seajs-flush',
    'seajs-health': 'luffy/seajs-health/0.1.0/seajs-health',
    // ===jquery===
    '$': 'lib/gallery/jquery/1.10.1/jquery',
    'jquery:': 'lib/gallery/jquery/1.10.1/jquery',
    '$-debug': 'lib/gallery/jquery/1.10.1/jquery-debug',
    'jquery-debug': 'lib/gallery/jquery/1.10.1/jquery-debug',
    // ===arale===
    'class': 'lib/arale/class/1.1.0/class',
    'base': "lib/arale/base/1.1.1/base",
    'events': 'lib/arale/events/1.1.0/events',
    'accordion': 'lib/arale/switchable/1.0.0/accordion',
    'widget': 'lib/arale/widget/1.1.1/widget',
    'templatable': 'lib/arale/templatable/0.9.2/templatable',
    'arale-switchable': 'lib/arale/switchable/1.0.0/switchable',
    'carousel': 'lib/arale/switchable/1.0.0/carousel',
    'tabs': 'lib/arale/switchable/1.0.0/tabs',
    'position': 'lib/arale/position/1.0.1/position',
    'dnd': 'lib/arale/dnd/1.0.0/dnd',
    'mask': 'lib/arale/overlay/1.1.3/mask',
    'popup': 'lib/arale/popup/1.1.5/popup',
    'overlay': 'lib/arale/overlay/1.1.3/overlay',
    'arale-validator-core': 'lib/arale/validator/0.9.6/core',
    'validator': 'lib/arale/validator/0.9.6/core',
    //		===gallery===
    'es5-safe': 'lib/gallery/es5-safe/0.9.2/es5-sage',
    'json': 'lib/gallery/json/1.0.3/json'
  },
  vars: {
    locale: 'zh-cn'
  },

  //	.映射配置
/*      	map: [
          ['http://alibaba.com/js/', 'http://whj.com/js/'],
          [ '.js', '-debug.js' ]
       ],*/

  //	old browser预加载
  preload: [
    '$',
    Function.prototype.bind ? '' : 'es5-safe',
    this.JSON ? '' : 'json',
    'seajs-text'
  ],
  charset: 'utf-8'
});

// 如果 url 里有 atom-debug=true 的话，就设置 debug 为 true
    if(location.search.indexOf('seajs-debug=true') != -1){
        seajs.config({debug:true});
    }


// 设置locale语言类型
// setLocale('zh-cn')
seajs.setLocale = function (locale) {
  if (locale) {
    seajs.config({
      vars: {
        locale: locale
      }
    });
  }
};

seajs.getLocale = function () {
  return seajs.data.vars.locale;
};