# 开启错误捕获服务

- order: 7

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
                <select data-errormessage-required="请选择您的国籍。" required="" id="country" name="country" class="ui-dropdown ui-dropdown-system">
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

    <button id="b1">手动js校验 “用户名”，不会触发事件</button>
    <button id="b2">停止监听</button>
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
        display: '用户名'
    });

    validator.addItem({
        element: '#country',
        required: true,
        display: '国籍'
    });
    
    validator.render();

    $('#b1').click(function(){
        var username = validator.query('#username');

        username.execute();
    });

    // 开启错误捕获
    Validator.enableTracker();

    // 监听用户操作（UI）导致的单项item错误事件
    Validator.on('itemErrorByUser', function(){
        console.log(arguments);
    });

    // 监听每次 submit 的情况
    Validator.on('formValidated', function(){
        console.log(arguments);
    });


    $('#b2').click(function(){
         // 关闭错误捕获
        Validator.disableTracker();
    });

    
});
</script>
````
