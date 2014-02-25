# 封装了ICBU dpl的带UI的tips组件

- order: 1

---



需要载入下面的css文件

- http://style.aliunicorn.com/css/6v/apollo/mod/balloon/balloon-sc.css

 
## 示例：最简单的tips

````iframe:100
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/balloon/balloon-sc.css" />
<div style="margin-top:60px;">hover后面那个“？”会显示tips哦！<span id="t1" style="padding:0 5px;font-weight:bold;border:1px solid #ccc;cursor:pointer;">?</span></div>

<script>
seajs.use(['$', 'js/6v/lib/icbu/balloon/balloon.js'], function($, Balloon){
	new Balloon({
		trigger: '#t1',
		arrowPosition: 'bl',
		content: '我是“？”的tips！'
	});
});
</script>
````

## 示例：多个trigger

````iframe:100
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/balloon/balloon-sc.css" />
<div style="margin-top:60px;">hover后面那些“？”会显示tips哦！
<span style="padding:0 5px;font-weight:bold;border:1px solid #ccc;cursor:pointer;">?</span>
<span style="padding:0 5px;font-weight:bold;border:1px solid #ccc;cursor:pointer;">?</span>
<span style="padding:0 5px;font-weight:bold;border:1px solid #ccc;cursor:pointer;">?</span>
<span style="padding:0 5px;font-weight:bold;border:1px solid #ccc;cursor:pointer;">?</span>
</div>

<script>
seajs.use(['$', 'js/6v/lib/icbu/balloon/balloon.js'], function($, Balloon){
	new Balloon({
		trigger: 'span',
		arrowPosition: 'bl',
		content: '我是“？”的tips！'
	});
});
</script>
````

## 示例：测试 destroy 
````iframe:100
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/balloon/balloon-sc.css" />
<div style="margin-top:60px;">“？”会显示tips！
<span style="padding:0 5px;font-weight:bold;border:1px solid #ccc;cursor:pointer;">?</span>
</div>
<button id="b">destroy</button>

<script>
seajs.use(['$', 'js/6v/lib/icbu/balloon/balloon.js'], function($, Balloon){
	var b = new Balloon({
		trigger: 'span',
		triggerType: 'none',
		arrowPosition: 'bl',
		content: '我是“？”的tips！'
	}).show();
	
	$('#b').one('click', function(){
		b.destroy();
	});
});
</script>
````

## 示例：边对齐的tips

````iframe:80
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/balloon/balloon-sc.css" />
<div id="t2" style="border:1px solid #ccc;width:150px;">某些情况下<br />可能需要边对齐<br />这样会显得比较好看</div>

<script>
seajs.use(['$', 'js/6v/lib/icbu/balloon/balloon.js'], function($, Balloon){
	new Balloon({
		trigger: '#t2',
		alignType: 'line',
		content: '正宗好代码，<br />正宗好tip'
	});
});
</script>
````

## 示例：人肉微调tips的位置（不建议使用）

````iframe:80
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/balloon/balloon-sc.css" />
<div id="t3" style="margin-left:190px;margin-top:10px;;width:80px;text-align:right;border:1px solid #000;padding:2px;">显示tips！<span style="padding:0 5px;font-weight:bold;border:1px solid #ccc;cursor:pointer;">?</span></div>

<script>
seajs.use(['$', 'js/6v/lib/icbu/balloon/balloon.js'], function($, Balloon){
	new Balloon({
		trigger: '#t3',
		alignType: 'line',
		content: '为了和“？”对齐，需要设置下offset！',
		arrowPosition: 'tr',
		offset: [4, 0]
	});
});
</script>
````

## 示例：triggerType 为 none （用js来控制显示/隐藏）

input focus的时候触发

````iframe:80
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/balloon/balloon-sc.css" />
<div id="t4" style="border:1px solid #ccc;width:440px;height:30px;padding-top:5px;">
<input name="n1" /> -
<input name="n2" /> -
<input name="n3" />
</div>

<script>
seajs.use(['$', 'js/6v/lib/icbu/balloon/balloon.js'], function($, Balloon){
	var b = new Balloon({
		trigger: '#t4',
		triggerType: 'none',
		alignType: 'line',
		content: '请按 YYYY-MM-DD的格式输入'
	});
	
	$('#t4 input').focus(function(){
		b.show();
	}).blur(function(){
		b.hide();
	});
});
</script>
````

## 示例：保证tips肯定在可视区域内


````iframe:300
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/balloon/balloon-sc.css" />
<div id="t5" style="margin-top:50px;border:1px solid #ccc;width:30px;height:18px;margin-left:300px;">内容</div>

<script>
seajs.use(['$', 'js/6v/lib/icbu/balloon/balloon.js'], function($, Balloon){
	new Balloon({
		trigger: '#t5',
		//alignType: 'line',
		width: 300,
		height: 200,
		content: '这个tips建议新窗口打开+调整窗口大小来测试<br />通过style增加点size，方便测试',
		inViewport: true
	});
});
</script>
````