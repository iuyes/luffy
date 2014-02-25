# Tic

- order: 2

---

提供统一、准确的跳秒事件。

---


## 配置说明

### timeServer `string`

供获取服务器时间的 URL，适用于对时间准确度要求较高的场景，参考 Timer 组件的使用方法。


## 方法说明

### onTic()

监听跳秒事件。

### offTic()

解除指定的跳秒事件监听。


## 最佳实践

跳秒

```js
seajs.use(['$', 'tic'], function($, Tic){
	// 设置为：从当前页面获取服务器时间
	Tic.set('timeServer', '');

	// 更新展示时间的方法
	function refreshTime( timeStamp ){
		$('#t-2').text( new Date(timeStamp) );
	}

	// 每秒更新最新时间
	Tic.onTic(function( nowTime ){
		refreshTime( nowTime );
	});
});
```
