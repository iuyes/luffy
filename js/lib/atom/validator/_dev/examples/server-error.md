# 服务器端返回错误信息

- order: 4

------------------------


````iframe:200

<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/feedback/feedback-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/button/button-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/dropdown/dropdown-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/radio/radio-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/checkbox/checkbox-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/textfield/textfield-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/form/form-sc.css" media="screen" />


<div class="cell">
     <form id="test-form" class="ui-form ui-form-horizontal">
        <div class="ui-form-item">
            <label for="username" class="ui-form-label">用户名<span class="ui-form-required">*</span>：</label>
            <div class="ui-form-control"> 
            	<input id="username" name="username" class="ui-textfield ui-textfield-system" value="test" /> <span class="ui-form-help">请用电子邮箱作为用户名</span>
	        </div>
        </div>
        <div class="ui-form-item">
            <label for="username" class="ui-form-label">国籍<span class="ui-form-required">*</span>：</label>
            <div class="ui-form-control">
                <select data-errormessage-required="请选择您的国籍。" required="" id="country" name="country" class="ui-dropdown ui-dropdown-system" data-widget-cid="widget-6">
                  <option value="">请选择</option>
                  <option value="china">China</option>
                  <option value="usa">USA</option>
                </select>
            </div>
        </div>
        <div class="ui-form-action">
            <button class="ui-button ui-button-primary ui-button-medium" type="submit">Submit</button>
        </div>
    </form>
</div>

<script>
seajs.use(['js/6v/lib/icbu/validator/validator.js', '$'], function(Validator, $) {
    var validator = new Validator({
        element: '#test-form'
    });

    validator.addItem({
        element: '#username',
        required: true,
        rule: 'email',
        display: '用户名',
        
        //或在对应的input上填写属性 data-server-errormessage="用户名格式不正确" 同样可以达到效果
        serverErrormessage:"用户名格式不正确"
    });

    validator.addItem({
        element: '#country',
        required: true,
        display: '国籍',
        
        //或在对应的input上填写属性 data-server-errormessage="请选择您的国籍。" 同样可以达到效果
        serverErrormessage:"请选择您的国籍。"
    });
    
    validator.render();
});
</script>
````
