# HTML 校验

- order: 1

-----------------------------------

## 自动从html配置的校验规则中生成校验器

````iframe:550

<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/feedback/feedback-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/button/button-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/dropdown/dropdown-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/radio/radio-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/checkbox/checkbox-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/textfield/textfield-sc.css" media="screen" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/form/form-sc.css" media="screen" />



<div id="test-form-wrap" class="cell">
    <form id="test-form" class="ui-form ui-form-horizontal" data-widget="js/6v/lib/icbu/validator/validator">
       
        <div class="ui-form-item">
            <label for="username" class="ui-form-label">用户名<span class="ui-form-required">*</span>：</label>
            <div class="ui-form-control"> 
            	<input id="username" name="username" class="ui-textfield ui-textfield-system" type="email" required data-display="用户名" /> <span class="ui-form-help">请用电子邮箱作为用户名</span>
	          </div>
        </div>

        <div class="ui-form-item">
            <label for="password" class="ui-form-label">密码<span class="ui-form-required">*</span>：</label>
            
            <div class="ui-form-control">
	            <input id="password" name="password" type="password" class="ui-textfield ui-textfield-system" data-errormessage="请输入5-20位的密码。" value="123456" required minlength="5" data-display="密码" />
          	</div>
        </div>

        <div class="ui-form-item">
            <label for="password-confirmation" class="ui-form-label">重复输入密码<span class="ui-form-required">*</span>：</label>
            
            <div class="ui-form-control">
	            <input id="password-confirmation" name="password-confirmation" type="password" class="ui-textfield ui-textfield-system" required data-rule="confirmation{target:'#password', name: '第二遍'}" data-errormessage-required="请再重复输入一遍密码，不能留空。" data-display="第一遍" />
	          </div>
        </div>

        <div class="ui-form-item">
            <label class="ui-form-label">性别<span class="ui-form-required">*</span>：</label>
            
            <div class="ui-form-control">
	            <label class="ui-label ui-label-wrapper ui-label-inline" for="male">
	            	<input id="male" class="ui-radio ui-radio-system" value="male" name="sex" type="radio" required data-errormessage-required="请选择您的性别。"> Male
	            </label>
	            
	            <label class="ui-label ui-label-wrapper ui-label-inline">
	           		<input id="female" class="ui-radio ui-radio-system" value="female" name="sex" type="radio"> Female
	            </label>
	          </div>

        </div>

        <div class="ui-form-item">
            <label class="ui-form-label">交通工具<span class="ui-form-required">*</span>：</label>
            <div class="ui-form-control">
	            <label for="Bike" class="ui-label ui-label-wrapper ui-label-inline">
	            	<input class="ui-checkbox ui-checkbox-system" required data-errormessage-required="请选择您的交通工具。" name="vehicle" id="Bike" type="checkbox">自行车
	            </label>
	            <label for="Car" class="ui-label ui-label-wrapper ui-label-inline">
	            	<input class="ui-checkbox ui-checkbox-system" name="vehicle" id="Car" type="checkbox">汽车
	            </label>
	          </div>
        </div>

        <div class="ui-form-item">
            <label class="ui-form-label">国籍<span class="ui-form-required">*</span>：</label>
            
            <div class="ui-form-control">
	            <select class="ui-dropdown ui-dropdown-system" name="country" required data-errormessage-required="请选择您的国籍。">
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
seajs.use(['js/6v/lib/arale/widget/widget.js'], function(Widget) {
	Widget.autoRenderAll('#test-form-wrap');
});
</script>
````