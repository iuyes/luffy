# 动态添加及删除元素

- order: 1

---
动态添加及删除元素


````html
<div id="demo1" style="vertical-aling:bottom">
  <ol id="item-list" class="min">
  	<li id="item-template" data-role="repeatable-item"><input type="text" value="" name="demo1">  <a data-role="repeatable-remove" href="#">移除</a></li>
  </ol>
  <a id="add-item" href="#" >+ 添加</a>
</div>
````

````js
//一般放置在页尾：
 seajs.use(['$', 'js/6v/lib/icbu/repeatable/repeatable.js'], function($, Repeatable) {

    var repeat1 = new Repeatable({
      cloneTemplate: $('#item-template'),
      element: $('#item-list'),

      //最少需要有一个元素
      min: 1,

      //最多只能添加到5个
      max: 5,

      onChangeLength: function(newVal, oldVal){
      	var ln = this.get('length');
      	
      	$('a:first', this.element).css('display', ln <= this.get('min') ? 'none' : '');
      	$('#add-item').prop('disabled', ln >= this.get('max') ? true : false);
      }

    })

    $('#add-item').on('click', function(){
      repeat1.clone();
    });

  });
````
