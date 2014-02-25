# 文本框智能出错定位

- order: 6

------------------------



````iframe:550

<style>
/* custom style for selection */
.high-light-focus::selection { background:#ffff00; }
.high-light-focus::-moz-selection { background:#ffff00; } 
.high-light-focus::-webkit-selection { background:#ffff00; }
</style>

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
            <label for="textarea-box" class="ui-form-label">文本框<span class="ui-form-required">*</span>：</label>
            
            <div class="ui-form-control">
                <textarea id="textarea-box" name="textarea-box" style="width:300px; height:150px;" autocomplete="off">Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. 你能找到我吗 Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this 你看不到我。 textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight 我躲在这里。 this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. ＨｉｇｈＬｉｇｈｔ this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea.我隐藏的很深 :) Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea.我是另一个错误 Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea.Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. 你能找到我吗 Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this Ｗord in this 你看不到我。 textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight 我躲在这里。 this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word ｉn this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea.我隐藏的很深 :) Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea.我是另一个错误 Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea.Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. 你能找到我吗 Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this 你看不到我。 textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight 我躲在这里。 this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea.我隐藏的很深 :) Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea.我是另一个错误 Highlight this word in this textarea. Highlight this word in this textarea. Highlight this word in this textarea.</textarea>
            </div>
        </div>


        <div class="ui-form-action">
        	<button class="ui-button ui-button-primary ui-button-medium" type="submit">确定</button>
        </div>



    </form>
</div>


<script>
seajs.use(['js/6v/lib/icbu/validator/validator.js', '$'], function(Validator, $) {
    var validator = new Validator({
        element: '#test-form'
    });

    validator.addItem({
        element: '[name=textarea-box]',
        required : true,
        rule: 'minlength{min: 5} errorchar',
        errormessageRequired: '请输入文字'
    });

    //validator.render();
});
</script>
````
