# Count Down

- order: 3

---

实现带 UI 的倒计时功能。

---


## 配置说明

### element `element`

倒计时容器。

### targetDate `number | string | date`

倒计时的目标时间。
 - Date对象，例：`new Date('2013/12/24 00:00:00 GMT+0800')`
 - 时间戳，例：`1387814400000`
 - 日期格式的字符串，例：`'2013/12/24 00:00:00 GMT+0800'`
 - 基于当前时间计算目标时间的自定义方法，例：`function ( nowTime ) { return nowTime + 3600000; }`（目标时间为当前时间一小时后）

### timeServer `string`

供获取服务器时间的 URL，适用于对时间准确度要求较高的场景，参考 Timer 组件的使用方法。

### remainingFormater `object`

自定义内容输出样式。


## 方法说明

### done()

提供倒计时`完成事件`回调接口。

### progress()

提供倒计时`跳秒事件`回调接口。


## 最佳实践

倒计时至某个时间点（服务器时间）

```html
<p id="cd-1">
    距离2014年1月1日还有: 
    <span data-role="day"></span>天
    <span data-role="hour"></span>小时
    <span data-role="minute"></span>分
    <span data-role="second"></span>秒
</p>
```

```js
// 实例化倒计时
seajs.use('count-down', function(CountDown){
    new CountDown({
        element: '#cd-1',
        targetTime: '2014/1/1 00:00:00 GMT+0800',
        timeServer: '' // 请求当前页面获取服务器时间
    });
});
```
