# validation 异步校验

- order: 5

--------------------

##通过服务器的返回值来校验邮箱


````iframe:200

<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/feedback/feedback-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/button/button-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/dropdown/dropdown-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/radio/radio-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/checkbox/checkbox-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/textfield/textfield-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/form/form-sc.css" media="screen" />


<div class="cell">

    <form id="test-form" class="ui-form ui-form-horizontal" data-widget="js/6v/lib/icbu/validator/validator">        
        <div class="ui-form-item">
            <label for="username" class="ui-form-label">用户名<span class="ui-form-required">*</span>：</label>
            <div class="ui-form-control"> 
            	<input id="username" name="username" class="ui-textfield ui-textfield-system" data-rule="email checkEmail" required data-display="用户名" /> <span class="ui-form-help">请用电子邮箱作为用户名</span>
	          </div>
        </div>
        
        <div class="ui-form-action">
        	<button class="ui-button ui-button-primary ui-button-medium" type="submit">Submit</button>
        </div>
    </form>

</div>


<script>
seajs.use(['js/6v/lib/arale/widget/widget.js', '$', 'js/6v/lib/icbu/validator/validator.js'], function(Widget, $, Validator) {
    Validator.addRule('checkEmail', function(options, commit) {
        var element = options.element,
            item = Validator.query('form').getItem(element);

        item.addClass('ui-form-item-loading');

        $.getJSON('email.json', function(data) {
            item.removeClass('ui-form-item-loading');                
            commit(data.error, data.message);
        });
    });
    
    Widget.autoRenderAll();
});
</script>
````
