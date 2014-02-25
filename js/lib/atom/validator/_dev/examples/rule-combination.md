# 校验规则组合

- order: 3

------------------------


有些注册表单中的一个场景是：用户名是电子邮箱或者手机。但是我们拥有的校验规则是电子邮箱和手机号码，应该怎么办？

使用校验规则组合可以组合出新的规则完成这种校验。

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
            	<input id="username" name="username" class="ui-textfield ui-textfield-system" data-rule="emailOrMobile" required data-display="用户名" /> 
            	<span class="ui-form-help">请输入电子邮箱或手机号</span>
	          </div>
        </div>
        
        <div class="ui-form-action">
        	<button class="ui-button ui-button-primary ui-button-medium" type="submit">Submit</button>
        </div>
    </form>

</div>

<script>
seajs.use(['js/6v/lib/arale/widget/widget.js', '$', 'js/6v/lib/icbu/validator/validator.js'], function(Widget, $, Validator) {
    //1. 获取校验规则对象
    var email = Validator.getRule('email');
    //2. 组合校验规则
    var emailOrMobile = email.or('mobile');
    //3. 注册新的校验规则
    Validator.addRule('emailOrMobile', emailOrMobile, '{{display}}的格式必须是电子邮箱或者手机号码。');

    Widget.autoRenderAll();
});
</script>
````
