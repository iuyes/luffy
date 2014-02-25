# 动态添加删除图片

- order: 2
---


<style>
	#item-list{
		list-style:none;
		padding:0;
		margin:0;
		clear:both;
	}
	
	#item-list li{
		width:100px;
		height:130px;
		border:1px solid #ccc;
		margin:8px;
		text-align:center;
		float: left;
	}
	
	li#add-item{
		border:1px dashed #ccc;
		font-size:150px;
		line-height:130px;
		font-weight:bold;
	}
	
	#add-item a{
		height:100%;
		width:100%;
	}
</style>

````html

<script type="text/template" id="item-template">
	<li data-role="repeatable-item"><img src="{{imgURL}}" width="100"> <a data-role="repeatable-remove" href="#">删除</a></li>
</script>

试试一直添加到第二行 <br />
图片数量 <span id="img-num">0</span>/10
<ul id="item-list"><li id="add-item" ><a  href="#">+</a></li></ul>
<div style="clear:both;"></div>

````

````js
//一般放置在页尾：
 seajs.use(['$', 'js/6v/lib/icbu/repeatable/repeatable.js'], function($, Repeatable) {
    var repeat1 = new Repeatable({
      cloneTemplate: $('#item-template').html(),
      
      element: $('#item-list'),
      
      //原有图片数据
      data:[{imgURL:'assets/t1.jpg'}],
      
      //最多只能添加到10个
      max: 10,
      
      onChangeLength: function(newVal, oldVal){
      	var ln = this.get('length');

      	$('#add-item').css('display', ln >= this.get('max') ? 'none' : '');
      	$('#img-num').html(ln);
      }
    });

    $('#add-item').on('click', function(){
      repeat1.clone({imgURL:'assets/t2.jpg'});
    });

  });
````
