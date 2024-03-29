# trigger

- order: 4

----

<link rel="stylesheet" href="http://style.aliunicorn.com/css??/6v/apollo/core/core-sc.css?t=0_0" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css??/6v/apollo/mod/dropdown/dropdown-sc.css?t=0_0" />

## trigger 的宽度和浮层的宽度保持一致

<div id="example7-1" class="ui-dropdown ui-dropdown-customize">
    <div data-role="trigger-content" class="ui-dropdown-layout">请选择</div>
    <div class="ui-dropdown-layout ui-dropdown-trigger">
        <div class="ui-dropdown-triangle">&nbsp;</div>
    </div>
</div>
<div id="example7-2" class="ui-dropdown ui-dropdown-customize">
    <div data-role="trigger-content" class="ui-dropdown-layout">请选择</div>
    <div class="ui-dropdown-layout ui-dropdown-trigger">
        <div class="ui-dropdown-triangle">&nbsp;</div>
    </div>
</div>

````javascript
seajs.use(['js/6v/lib/icbu/select/select.js','jquery'], function(Select, $) {
    new Select({
        trigger: '#example7-1',
        model: [
            {value:'option1', text:'aaaaaaaaaaaaaaaa'},
            {value:'option2', text:'字比较少'},
            {value:'option3', text:'字比较少'}
        ]
    }).render();

    new Select({
        trigger: '#example7-2',
        model: [
            {value:'option1', text:'字好多多aaa多多多多多'},
            {value:'option2', text:'字比较多'},
            {value:'option3', text:'字比较多'}
        ]
    }).render();
});
````

## 自定义 trigger

需要指定 `data-role="trigger-content"`，否则会覆盖整个 trigger 的内容

````html
<a href="#" id="example8"><span data-role="trigger-content"></span><span>x</span></a>
````

````javascript
seajs.use(['js/6v/lib/icbu/select/select.js','jquery'], function(Select, $) {
    new Select({
        trigger: '#example8',
        model: [
            {value:'option1', text:'option1'},
            {value:'option2', text:'option2'}
        ]
    }).render();
});
````
