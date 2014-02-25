# UI复杂一点的示例

- order: 2

---

如果配置了 title 和 hasCloseX 之后，默认UI会更加复杂


需要载入下面的css文件

- http://style.aliunicorn.com/css/6v/apollo/mod/balloon/balloon-sc.css
- http://style.aliunicorn.com/css/6v/apollo/mod/notice/notice-sc.css

 
## 示例：最简单的带title的tips

````iframe:150
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/balloon/balloon-sc.css" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/notice/notice-sc.css" />
<div style="margin-top:110px;">hover后面那个“？”会显示tips哦！<span id="t1" style="padding:0 5px;font-weight:bold;border:1px solid #ccc;cursor:pointer;">?</span></div>

<script>
seajs.use(['$', 'js/6v/lib/icbu/balloon/balloon.js'], function($, Balloon){
	new Balloon({
		trigger: '#t1',
		arrowPosition: 'bl',
		content: '我是“？”的tips！',
		title: '我是tips的title'
	});
});
</script>
````

## 示例：带closeX的tips，且只能通过closeX关闭

````iframe:150
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/balloon/balloon-sc.css" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/notice/notice-sc.css" />
<div style="margin-top:110px;">后面那个“？”有显示tips！<span id="t1" style="padding:0 5px;font-weight:bold;border:1px solid #ccc;cursor:pointer;">?</span></div>

<script>
seajs.use(['$', 'js/6v/lib/icbu/balloon/balloon.js'], function($, Balloon){
	new Balloon({
		trigger: '#t1',
		triggerType: 'none',
		arrowPosition: 'bl',
		content: '帮助帮助帮助帮助帮助帮助帮助帮助帮助帮助',
		hasCloseX: true
	}).show();
});
</script>
````