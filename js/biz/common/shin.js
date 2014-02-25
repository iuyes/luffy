/**
 * array判断元素的索引
 */
if (!Array.indexOf) {
  Array.prototype.indexOf = function (obj) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == obj) {
        return i;
      }
    }
    return -1;
  }
}

/**
 * 获取array的值的索引
 * @type {Function}
 */
var arrIndexOf = Array.prototype.indexOf ? function (arr, item) {
  return arr.indexOf(item);
} : function (arr, item) {
  for (var i = 0, length = arr.length; i < length; i++) {
    if (arr[i] == item) {
      return i;
    }
  }
  return -1;
}

/**
 * array删除元素
 */
if (!Array.removeEle) {
  Array.prototype.removeEle = function (e) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === e) {
        this.splice(i, 1);
        return;
      }
    }
  }
}


/**
 * array根据索引删除元素
 */
if (!Array.removeInd) {
  Array.prototype.removeInd = function (i) {
    this.splice(i, 1);
    return;
  }
}

/**
 * 删除array的重复元素
 */
if (!Array.delrepeat) {
  Array.prototype.delrepeat = function () {
    var newarr = this;
    for (var i = newarr.length - 1; i >= 0; i--) {
      var targetnode = newarr[i];
      for (var j = 0; j < i; j++) {
        if (targetnode == newarr[j]) {
          newarr.splice(i, 1);
          break;
        }
      }
    }
    return newarr;
  }
}

/**
 * 停止事件冒泡
 * @param e
 */
function stopEvent(e) {
  e = e || window.event;
  if (window.event) {
    // IE
    e.cancelBubble();
  }
  else {
    e.stopPropagation();
  }
};

/**
 * 取消浏览器的默认行为
 * @param e
 */
function stopDefault(e) {
  var e = e || window.event;
  e.preventDefault();
  window.event.returnValue = false;
}


/**
 * 对象深度克隆
 */
if (!Object.clone) {
  Object.prototype.clone = function () {
    var o = this.constructor === Array ? [] : {};
    for (var e in this) {
      o[e] = typeof this[e] === "object" ? this[e].clone() : this[e];
    }
    return o;
  }
}


/**
 * 非构造函数的继承(深度克隆)
 * @param p 被继承的对象
 * @param c 继承对象
 * @returns {*|{}}
 */
function objInherit(p, c) {
  var c = c || {};
  for (var i in p) {
    if (typeof p[i] === 'object') {
      c[i] = (p[i].constructor === Array) ? [] : {};
      objInherit(p[i], c[i]);
    } else {
      c[i] = p[i];
    }
  }
  return c;
}


/**
 * 清除空白
 */
if (!String.trim) {
  String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
  }
}
if (!String.ltrim) {
  String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
  }
}
if (!String.rtrim) {
  String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, "");
  }
}


/**
 * 获取字符串出现最多的字符
 * @param str
 * @returns {string|*}
 */
function getmoststr(str) {
  var maxlen = 0; //初始化出现次数最高的字符的次数
  var result = ""; //用来显示结果的字符串
  while (str != '') { //循环迭代开始，并判断字符串是否为空
    oldStr = str; //把字符串赋值给oldStr，一边下面计算出现次数最多字符次数
    getStr = str.substring(0, 1); //取字符串首字母
    eval("str = str.replace(/" + getStr + "/g,'')"); //全局搜索既在str中查找
    if (oldStr.length - str.length > maxlen) { //如果现在出现次数最多字符次数比上一次多
      maxlen = oldStr.length - str.length; //计算新的出现字符次数最多的字符的次数
      result = getStr;
    }
  }
  return getStr;
}

/**
 * 获取字符串字符出现最多的次数
 * @param str
 * @returns {number}
 */
function getmostnum(str) {
  var maxlen = 0; //初始化出现次数最高的字符的次数
  var result = ""; //用来显示结果的字符串
  while (str != '') { //循环迭代开始，并判断字符串是否为空
    oldStr = str; //把字符串赋值给oldStr，一边下面计算出现次数最多字符次数
    getStr = str.substring(0, 1); //取字符串首字母
    eval("str = str.replace(/" + getStr + "/g,'')"); //全局搜索既在str中查找
    if (oldStr.length - str.length > maxlen) { //如果现在出现次数最多字符次数比上一次多
      maxlen = oldStr.length - str.length; //计算新的出现字符次数最多的字符的次数
      result = getStr;
    }
  }
  return maxlen;
}

/**
 * 获取字符串的字节长度英文1个中文2个
 * @param str
 * @returns {Function|o.length|n.attrs.length|k.attrs.length|defaults.length|Number|*}
 * @constructor
 */
function GetBytes(str) {
  var len = str.length;
  var bytes = len;
  for (var i = 0; i < len; i++) {
    if (str.charCodeAt(i) > 255) bytes++;
  }
  return bytes;
}


/**
 * 异步加载js非阻塞
 * @param url
 * @param callback
 */
function loadscript(url, callback) {
  var script = document.createElement('script');
  script.type = "text/javascript";
  script.async = true;
  script.charset = 'UTF-8';
  if (script.readyState) {
    //for IE
    script.onreadystatechange = function () {
      if (script.readyState == 'loaded' || script.readyState == 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    }
  }
  else {
    script.onload = function () {
      callback();
    }
  }
  script.src = url;
  document.body.appendChild(script);
}


/**
 * 图片预加载
 * @param url
 * @param callback
 */
function loadImage(url, callback) {
  var img = new Image(); //创建一个Image对象，实现图片的预下载
  img.onload = function () {
    img.onload = null;
    callback(img);
  }
  img.src = url;
}


/**
 * need jquery
 * 素的data-api是否off
 * @param element
 * @returns {boolean}
 */
function eleDataapiOff(element) {
  var isDefaultOff = $(document.body).attr("data-api") === "off";
  var elementDataApi = $(element).attr("data-api");
  // data-api 默认开启，关闭只有两种方式：
  //  1. element 上有 data-api="off"，表示关闭单个
  //  2. document.body 上有 data-api="off"，表示关闭所有
  return elementDataApi === "off" || elementDataApi !== "on" && isDefaultOff;
}


/**
 * 将 'false' 转换为 false 'true' 转换为 true '3253.34' 转换为 3253.34
 * @param val
 * @returns {*}
 */
function normalizeValue(val) {
  if (val.toLowerCase() === 'false') {
    val = false
  }
  else if (val.toLowerCase() === 'true') {
    val = true
  }
  else if (/\d/.test(val) && /[^a-z]/i.test(val)) {
    var number = parseFloat(val)
    if (number + '' === val) {
      val = number
    }
  }

  return val
}


/**
 * 兼容性添加事件
 * @param ele
 * @param type
 * @param func
 */
function addEventHandler(ele, type, func) {
  if (ele.addEventListener)
    ele.addEventListener(type, function () {
      func.apply(ele, arguments);
    }, false);
  else if (ele.attachEvent)
    ele.attachEvent("on" + type, function () {
      func.apply(this, arguments);
    });
  else ele["on" + type] = func;
}


/**
 * 兼容性删除事件
 * @param ele
 * @param type
 * @param func
 */
function removeEventHandler(ele, type, func) {
  if (ele.removeEventListener) {
    ele.removeEventListener(type, function () {
      func.apply(ele, arguments);
    }, false);
  }
  else if (ele.detachEvent) {
    ele.detachEvent("on" + type, function () {
      func.apply(this, arguments);
    });
  }
  else {
    delete  ele["on" + type];
  }
}


/**
 * 获取浏览器信息
 * @returns {类型:版本}
 */
function getBrowser() {
  var Sys = {};
  var ua = navigator.userAgent.toLowerCase();
  var s;
  +
      (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
      (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
          (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
              (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                  (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
  return Sys;
}


/**
 * DOM加载完成后执行fnc而不必等图片等加载完成
 * @param fnc
 */
function onDOMReady(f) {

  if (win.jQuery) {
    // 如果页面上存在 jQuery，使用 jQuery 的方法
    jQuery(doc).ready(f);

  } else {

    // 判断页面是否已经加载完成
    if (doc.readyState === "complete") {
      // 如果页面已经加载完成，直接执行函数 f
      f();

    } else {
      // 使用 window 的 onload 事件
      addEventListener(win, "load", f);
    }

  }
}

/**
 * 兼容性写法
 * @param element
 * @returns {string|innerText|*|textContent}
 */
function getInnerText(element) {
  return element.innerText || element.textContent;
}

/**
 *
 * @param obj 检测对象
 * @returns {string}
 */
function objType(obj) {
  switch (Object.prototype.toString.call(obj)) {
    case '[object Array]':
      return 'array';
      break;

    case '[object Date]':
      return 'date';
      break;

    case  '[object Boolean]':
      return 'boolean';
      break;

    case  '[object String]':
      return 'string';
      break;

    case '[object Number]':
      return 'number';
      break;

    case '[object Function]':
      return 'function';
      break;

    case '[object RegExp]':
      return 'regexp';
      break;

    case '[object HTMLDivElement]':
      return 'htmlelement';
      break;

    case '[object Object]':
      return 'object';
      break;

    default:
      return 'unknow';
      break;
  }
}


/**
 *
 * @returns {Function}
 */
var requestAFrame = function () {
  return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
    // if all else fails, use setTimeout
      function (callback) {
        return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
      };
}

/**
 *
 * @returns {*|Function}
 */
var cancelAFrame = function () {
  return window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      function (id) {
        window.clearTimeout(id);
      }
}

/**
 * 首字母大写
 * @param str
 * @returns {string}
 */
function ucfirst(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}


/**
 * 获取元素的子元素节点
 * @param ele
 */
function getChildEleNodes(ele) {
  var ele_nodes = ele.childNodes, eleArr = new Array();
  for (var i = 0; i < ele_nodes.length; i++) {
    if (ele_nodes[i].nodeType == 1) {
      eleArr.push(ele_nodes[i]);
    }
  }
  return eleArr;
}

/**
 * 兼容性的获取元素的当前样式
 * @param ele 元素
 * @param style {display font-size}
 * @returns {string}
 */
function getType(ele, style) {
  //  helper
  function firstUpper(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  function firstLower(str) {
    return str.charAt(0).toLowerCase() + str.substr(1);
  }

  if (window.getComputedStyle) {
    return window.getComputedStyle(ele).getPropertyValue(style);
  } else {
    /**
     * for IE
     * background-color -> backgroundColor
     */
    if (style.indexOf('-') !== -1) {
      var styleArr = style.split('-'), _style = '';
      for (var i = 0; i < styleArr.length; i++) {
        _style += firstUpper(styleArr[i]);
      }
      _style = firstLower(_style);
      return ele.currentStyle.getAttribute(_style);
    } else {
      return ele.currentStyle.getAttribute(style);
    }
  }
}

/**
 * 模拟促发点击事件
 * @param ele 元素
 */
function triggerClick(ele) {
  if (ele.click) {
    ele.click();
  } else {
//    适用与webkit浏览器
    var evt = document.createEvent('Event');
    evt.initEvent('click', true, true);
    ele.dispatchEvent(evt);
  }
}


/**
 * 合并(后者会覆盖前者的值，个数仍是前者的个数)
 * @param one 第一个对象
 * @param two 第二个对象
 * @returns {{}} 返回新对象
 */
function merge(one, two) {
  var ret = {}, key;
  for (key in one) {
    if (one.hasOwnProperty(key)) {
      ret[key] = two[key] || one[key];
    }
  }
  return ret;
}


/**
 *
 * @param url
 * @param width
 * @param height
 * @returns {string}
 */
var agt = navigator.userAgent.toLowerCase();
var is_ie = ((agt.indexOf('msie') != -1) && (agt.indexOf('opera') == -1));
function player_rm(url, width, height) {
  if (is_ie) {
    return "<object classid=\"CLSID:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA\" width=\"" + width + "\" height=\"" + height + "\"><param name=\"src\" value=\"" + url + "\" /><param name=\"controls\" value=\"Imagewindow\" /><param name=\"console\" value=\"clip1\" /><param name=\"autostart\" value=\"true\" /></object><br /><object classid=\"CLSID:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA\" width=\"" + width + "\" height=\"44\"><param name=\"src\" value=\"" + url + "\" /><param name=\"controls\" value=\"ControlPanel,StatusBar\" /><param name=\"console\" value=\"clip1\" /><param name=\"autostart\" value=\"true\" /></object>";
  } else if (agt.indexOf('firefox') != -1) {
    return "<object data=\"" + url + "\" type=\"audio/x-pn-realaudio-plugin\" width=\"" + width + "\" height=\"" + height + "\" autostart=\"true\" console=\"clip1\" controls=\"Imagewindow\"><embed src=\"" + url + "\" type=\"audio/x-pn-realaudio-plugin\" autostart=\"true\" console=\"clip1\" controls=\"Imagewindow\" width=\"" + width + "\" height=\"" + height + "\"></embed></object><br /><object data=\"" + url + "\" type=\"audio/x-pn-realaudio-plugin\" width=\"" + width + "\" height=\"44\" autostart=\"true\" console=\"clip1\" controls=\"ControlPanel,StatusBar\"><embed src=\"" + url + "\" type=\"audio/x-pn-realaudio-plugin\" autostart=\"true\" console=\"clip1\" controls=\"ControlPanel,StatusBar\" width=\"" + width + "\" height=\"44\"></embed></object>";
  } else if (agt.indexOf('safari') != -1) {
    return "<object type=\"audio/x-pn-realaudio-plugin\" width=\"" + width + "\" height=\"" + height + "\"><param name=\"src\" value=\"" + url + "\" /><param name=\"controls\" value=\"Imagewindow\" /><param name=\"console\" value=\"clip1\" /><param name=\"autostart\" value=\"true\" /></object><br /><object type=\"audio/x-pn-realaudio-plugin\" width=\"" + width + "\" height=\"44\"><param name=\"src\" value=\"" + url + "\" /><param name=\"controls\" value=\"ControlPanel,StatusBar\" /><param name=\"console\" value=\"clip1\" /><param name=\"autostart\" value=\"true\" /></object>";
  } else {
    return "<object classid=\"clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA\" width=\"" + width + "\" height=\"" + height + "\"><param name=\"src\" value=\"" + url + "\" /><param name=\"controls\" value=\"Imagewindow\" /><param name=\"console\" value=\"clip1\" /><param name=\"autostart\" value=\"true\" /><embed src=\"" + url + "\" type=\"audio/x-pn-realaudio-plugin\" autostart=\"true\" console=\"clip1\" controls=\"Imagewindow\" width=\"" + width + "\" height=\"" + height + "\"></embed></object><br /><object classid=\"clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA\" width=\"" + width + "\" height=\"44\"><param name=\"src\" value=\"" + url + "\" /><param name=\"controls\" value=\"ControlPanel\" /><param name=\"console\" value=\"clip1\" /><param name=\"autostart\" value=\"true\" /><embed src=\"" + url + "\" type=\"audio/x-pn-realaudio-plugin\" autostart=\"true\" console=\"clip1\" controls=\"ControlPanel,StatusBar\" width=\"" + width + "\" height=\"44\"></embed></object>";
  }
}
function player_flash(url, width, height) {
  if (is_ie) {
    return "<object classid=\"CLSID:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\"" + width + "\" height=\"" + height + "\"><param name=\"src\" value=\"" + url + "\" /><param name=\"autostart\" value=\"true\" /><param name=\"loop\" value=\"true\" /><param name=\"quality\" value=\"high\" /></object>";
  } else {
    return "<object data=\"" + url + "\" type=\"application/x-shockwave-flash\" width=\"" + width + "\" height=\"" + height + "\"><param name=\"autostart\" value=\"true\" /><param name=\"loop\" value=\"true\" /><param name=\"quality\" value=\"high\" /><EMBED src=\"" + url + "\" quality=\"high\" width=\"" + width + "\" height=\"" + height + "\" TYPE=\"application/x-shockwave-flash\" PLUGINSPAGE=\"http://www.macromedia.com/go/getflashplayer\"></EMBED></object>";
  }
}
function player_wmv(url, width, height) {
  if (height < 64) height = 64;
  if (is_ie) {
    return "<object classid=\"CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95\" width=\"" + width + "\" height=\"" + height + "\"><param name=\"src\" value=\"" + url + "\" /><param name=\"ShowStatusBar\" value=\"true\" /></object>";
  } else if (agt.indexOf('firefox') != -1) {
    return "<object data=\"" + url + "\" type=\"application/x-mplayer2\" width=\"" + width + "\" height=\"" + height + "\" ShowStatusBar=\"true\"><embed type=\"application/x-mplayer2\" src=\"" + url + "\" width=\"" + width + "\" height=\"" + height + "\" ShowStatusBar=\"true\"></embed></object>";
  } else if (agt.indexOf('safari') != -1) {
    return "<object type=\"application/x-mplayer2\" width=\"" + width + "\" height=\"" + height + "\"><param name=\"src\" value=\"" + url + "\" /><param name=\"ShowStatusBar\" value=\"true\" /></object>";
  } else {
    return "<object classid=\"CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95\" width=\"" + width + "\" height=\"" + height + "\"><param name=\"src\" value=\"" + url + "\" /><param name=\"ShowStatusBar\" value=\"true\" /><embed type=\"application/x-mplayer2\" src=\"" + url + "\" width=\"" + width + "\" height=\"" + height + "\" ShowStatusBar=\"true\"></embed></object>";
  }
}
function player_flv(url, width, height) {

  return "<object type=\"application/x-shockwave-flash\" data=\"" + imgpath + "/vcastr3.swf\" width=\"" + width + "\" height=\"" + height + "\"><param name=\"movie\" value=\"" + imgpath + "/vcastr3.swf\"/><param name=\"allowFullScreen\" value=\"true\" /><param name=\"FlashVars\" value=\"xml=<vcastr><channel><item><source>" + url + "</source></item></channel><config><isAutoPlay>false</isAutoPlay><isShowAbout>false</isShowAbout></config><plugIns></plugIns></vcastr>\"/></object>";
}
function player_taohua(url, width, height) {

  return "<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\"" + width + "\" height=\"" + height + "\"><param name=\"movie\" value=\"" + url + "\"/><param name=\"quality\" value=\"best\" /><param name=\"bgcolor\" value=\"#000000\" /><param name=\"allowScriptAccess\" value=\"sameDomain\"/><param name=\"allowFullScreen\" value=\"true\"/><param name=\"wmode\" value=\"transparent\" /></object>";

}


/**
 * 使用cssText一次性的改变元素的样式避免多次回流
 * @param el
 * @param strCss
 */
function setStyle(el, strCss) {
  /**
   * 验证字符串是否由什么结束
   * @param str  字符串
   * @param suffix 分隔符
   * @returns {boolean}
   */
  function endsWith(str, suffix) {
    var l = str.length - suffix.length;
    return l >= 0 && str.indexOf(suffix, l) == l;
  }

  var sty = el.style,
      cssText = sty.cssText;
  if (!endsWith(cssText, ';')) {
    cssText += ';';
  }
  sty.cssText = cssText + strCss;
}

/**
 * 获取查询字符串的键值
 * @param variable 查询字符串的键
 * @returns {*}
 */
function getQueryVariable(variable) {
  var querystr = window.location.search.substring(1);
  var queryarr = querystr.split('&');
  for (var i = 0, lng = queryarr.length; i < lng; i++) {
    var pair = queryarr[i].split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return '';
}


function nodeListToArray(nodes) {
  var arr, length;

  try {
    // works in every browser except IE
    arr = [].slice.call(nodes);
    return arr;
  } catch (err) {
    // slower, but works in IE
    arr = [];
    length = nodes.length;

    for (var i = 0; i < length; i++) {
      arr.push(nodes[i]);
    }

    return arr;
  }
}


function createElement() {
  var iframe = document.createElement('iframe');
  iframe.setAttribute('frameborder', '0', 0);
  return iframe;
}