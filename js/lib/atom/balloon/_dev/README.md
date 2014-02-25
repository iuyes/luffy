# Balloon

// 封装了ICBU dpl的带UI的tips组件

---

## DPL地址

dpl地址请[点击](http://dpl.aliui.com/?cat=12)，[notice相关部分](http://dpl.aliui.com/?p=1347)

---

Balloon 继承了 [Popup](http://docs.alif2e.com/arale/popup/)，可使用其属性和方法。


## 模块依赖

 - seajs
 - jquery
 - popup

## 配置说明

### template `string`

内容模板，正常情况下请勿修改，已经封装了DPL的样式及html结构

如果要修改，注意data-role的指定

### trigger `element|string`

触发元素。

### triggerType `string`

触发类型，可选[hover|click|none]，默认为 hover。
	
特别地，当 triggerType 为 none 时，只能用 show/hide 方法进行控制。

### distance `number`

element与目标的距离（px），注意, __箭头元素可能超出element，这个距离要额外增加__。默认为10。

### content `string|function`

指定内容的html，dom由`data-role="content"`指定。

### title `string|function`

指定标题的html，dom由`data-role="title"`指定。
	
注意，指定了该属性后，将变为 ui-notice 的UI模式。

### hasCloseX `boolean`

是否存在关闭的X标签，dom由`data-role="close"`指定。默认为 false。
	
注意，指定了该属性后，将变为 ui-notice 的UI模式。

### arrowPosition `string`

箭头位置，可选[tl|tr|rt|rb|br|bl|lb|lt]，默认`lt`！dom由`data-role="arrow"`指定。

### alignType `string`

balloon的对齐方式，可选[arrow|line]，默认为`arrow`，具体的对齐与`arrowPosition`有关
	
- arrow: 箭头的中点与trigger的中点对齐
- line: balloon的边与trigger的边对齐

### offset `array`

如果以上的对齐方式不能满足你，可以用这个做微调，__尽量不使用！__，默认[0,0]
	
正值代表向 右/下 偏移（增加 left/top），负值代表向 左/上 偏移（减少 left/top）

### inViewport `boolean`

在show的时候如果在屏幕外，是否要自动转换到屏幕内，默认为`false`


其他配置参照

- [Popup](http://docs.alif2e.com/arale/popup/)


## 最佳实践

1. 直接使用

	```js
	// 点击id="trigger"后在trigger下方展示（箭头方向为“上左”）的tips
	var o = new Balloon({
		trigger: '#trigger',
		triggerType: 'click',
		arrowPosition: 'tl',
		content: '这个是个箭头在上左的tips'
	});
	```
	
2. 一直展示的tips

	```js
	// 和id="test"上边对齐左方展示(箭头方向为“右上”)的tips
	var o = new Balloon({
		trigger: '#test',
		triggerType: 'none',
		arrowPosition: 'rt',
		alignType: 'line',
		content: '这个是箭头在右上的tips'
	}).show();
	```
	
3. 会自动调整方向的tips

	```js
	// hover id="trigger"后在trigger右方展示（箭头方向为“左上”）的tips
	// 如果右边的空间不足（超出屏幕），自动转到左边
	
	var o = new Balloon({
		trigger: '#trigger',
		arrowPosition: 'lt',
		content: '这个是个箭头在左上的tips，同时会自动控制弹出的位置',
		inViewport: true
	});
	```