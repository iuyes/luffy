# Timer

- order: 1

---

用于获取准确的服务器时间。

---

## 配置说明

### timeServer

供获取服务器时间的 URL，
 - 传入同域下某个页面的URL，建议是一个静态页面
 - 传入值为空字符串`''`，则请求本页面
 - 不传值，则取本地时间作为当前时间

**说明：**
timer.js 会以 AJAX 方式请求 timerServer 对应的 URL（HEAD请求），读取响应头中的 `date` 字段来获取到当前的服务器时间。


## 最佳实践

获取服务器时间

```html
当前页面所在的服务器时间：<span id="t-1"></span>
```

```js
seajs.use(['$', 'timer'], function($, Timer){

    // 设置为：从当前页面获取服务器时间
    Timer.set('timeServer', '');

    // 获取时间
    Timer监听跳秒事件.getTime(function( nowTime ){
        $('#t-1').text( new Date(nowTime) );
    });
});
```
