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
    e.cancleBubble=true;
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
  if(e&e.preventDefault){
    e.preventDefault();
  }else{
    e.returnValue = false;
  }  
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
    img.src = url;
    if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
     document.getElementById("allpic").appendChild(img);
        callback();
        return; // 直接返回，不用再处理onload事件
     }
     img.onload = function () { //图片下载完毕时异步调用callback函数。
      document.getElementById("allpic").appendChild(img);
         callback();//将回调函数的this替换为Image对象
     };
};


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
    ele.addEventListener(type, func, false);
  else if (ele.attachEvent)
    ele.attachEvent("on" + type, func);
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
    ele.removeEventListener(type, func, false);
  }
  else if (ele.detachEvent) {
    ele.detachEvent("on" + type, func);
  }
  else {
    delete  ele["on" + type];
  }
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

// 检测是否是空对象{}
  function isEmptyObj (obj) {
    for(var i in obj){
      return false;
    }
    return true;
  }

// 检测是否是中文
  function isChinese(str){
    var reg = /^[\u4E00-\u9FA5]+$/g;
      if(!reg.test(str)){
        return false;
      }
       return true;
  }

  function isNum(str){
          var reg = /^[0-9]*$/;
          if(!reg.test(str)){
            return false; 
          }
          return true;
        }


// 添加收藏夹
function addFavorites(url,name){
      if (document.all){
        window.external.addToFavoritesBar(url,name);
        } else if (window.sidebar)  {
         window.sidebar.addPanel(name, url, "");
        } else {
           alert('关闭本提示后，请使用Ctrl+D添加到收藏夹');
        }
}

// 兼容性的获取clientwidth,clientheight,scrollwidth,scrollheight,scrollleft,scrolltop
if (document.compatMode == "BackCompat") { 
cWidth = document.body.clientWidth; 
cHeight = document.body.clientHeight; 
sLeft = document.body.scrollLeft; 
sTop = document.body.scrollTop; 
} 
else {
cWidth = document.documentElement.clientWidth; 
cHeight = document.documentElement.clientHeight; 
sLeft = document.documentElement.scrollLeft == 0 ? document.body.scrollLeft : document.documentElement.scrollLeft;
sTop = document.documentElement.scrollTop == 0 ? document.body.scrollTop : document.documentElement.scrollTop;
} 

// 获取元素在视窗中的位置(Left)
  function getElementViewLeft(element){
　　　　var actualLeft = element.offsetLeft;
　　　　var current = element.offsetParent;
　　　　while (current !== null){
　　　　　　actualLeft += current.offsetLeft;
　　　　　　current = current.offsetParent;
　　　　}
　　　　if (document.compatMode == "BackCompat"){
　　　　　　var elementScrollLeft=document.body.scrollLeft;
　　　　} else {
　　　　　　var elementScrollLeft=document.documentElement.scrollLeft; 
　　　　}
　　　　return actualLeft-elementScrollLeft;
　　}      
// 获取元素在视窗中的位置(TOP)
  function getElementViewTop(element){
　　　　var actualTop = element.offsetTop;
　　　　var current = element.offsetParent;
　　　　while (current !== null){
　　　　　　actualTop += current. offsetTop;
　　　　　　current = current.offsetParent;
　　　　}
　　　　 if (document.compatMode == "BackCompat"){
　　　　　　var elementScrollTop=document.body.scrollTop;
　　　　} else {
　　　　　　var elementScrollTop=document.documentElement.scrollTop; 
　　　　}
　　　　return actualTop-elementScrollTop;
　　}

// 设置中文字符的长度 默认是1
function setCharLenght(str,num){
  var restr='';
  for(var i=0;i<num;i++){
    restr+='x';
  }
  var strReg = /[^\x00-\xff]/g;
  return str.replace(strReg,restr).length;
}

/**
 * 获取鼠标赋值内容
 */
function getSelectionText(){
  if(window.getSelection){
    return window.getSelection();
  }
  else if(document.getSelection){
    return document.getSelection();
  }
  else if(document.selection){
    return document.selection.createRange().text;
  }
}
