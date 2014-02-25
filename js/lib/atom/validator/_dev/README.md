# Validator

-----

Validator 是表单校验组件。

---

Validator 继承了 [Arale/Validator](http://docs.alif2e.com/arale/validator/)，可使用其属性和方法。


## 模块依赖

*   [seajs](seajs)
*   [widget](widget)
*   [jquery](jquery)

## Feature List

*   HTML5 form API。

*   data-attribute API。

*   异步校验。

*   校验规则的组合，与、或、非。

*   校验规则的 dynamic binding，和 unbinding。 

*   (TODO)关联性校验/级联校验。例如当满足一个条件时校验某种规则，满足另外的条件校验其他规则。

## How to Use

提供两种方式调用：

*   DOM。利用 html5 form API 和 data-attribute 在 DOM 中完成调用。
*   JS API。在 javascript 代码中完成 validator 配置和调用。

### DOM调用

HTML

```html
<form data-widget="js/6v/lib/icbu/validator/validator.js" class="ui-form">
    <div class="ui-form-item">
        <label for="username" class="ui-label"><span class="ui-form-required">*</span>用户名：</label>
        <input id="username" name="username" class="ui-input" required type="email" minlength="1" maxlength="20" />
        <div class="ui-form-explain">用户名为电子邮箱。</div>
    </div>

    <div class="ui-form-item ui-form-item-error">
        <label for="password" class="ui-label"><span class="ui-form-required">*</span>密码：</label>
        <input id="password" name="password" type="password" class="ui-input" minlength="5" />
        <div class="ui-form-explain">密码的长度必须大于或等于5。</div>
    </div>

    <div class="ui-form-item">
        <label for="password-confirmation" class="ui-label"><span class="ui-form-required">*</span>重复输入密码：</label>
        <input id="password-confirmation" name="password-confirmation" type="password" class="ui-input" data-rule="confirmation{target: '#password'}" />
    </div>

    <div class="ui-form-item">
        <span class="ui-button-morange ui-button"><input class="ui-button-text" value="确定" type="submit"></span>
    </div>
</form>
```

JS

```js
seajs.use(['js/6v/lib/arale/widget/widget.js', '$'], function(Widget, $) {
    $(function() {
        // 初始化所有使用`data-widget`指定的组件。
        Widget.autoRenderAll();
    });
});
```

### JS API

HTML

```html
<form class="ui-form">
    <div class="ui-form-item">
        <label for="username" class="ui-label"><span class="ui-form-required">*</span>用户名：</label>
        <input id="username" name="username" class="ui-input" />
        <div class="ui-form-explain">用户名为电子邮箱。</div>
    </div>

    <div class="ui-form-item ui-form-item-error">
        <label for="password" class="ui-label"><span class="ui-form-required">*</span>密码：</label>
        <input id="password" name="password" type="password" class="ui-input" />
        <div class="ui-form-explain">密码的长度必须大于或等于5。</div>
    </div>

    <div class="ui-form-item">
        <label for="password-confirmation" class="ui-label"><span class="ui-form-required">*</span>重复输入密码：</label>
        <input id="password-confirmation" name="password-confirmation" type="password" class="ui-input" />
    </div>

    <div class="ui-form-item">
        <span class="ui-button-morange ui-button"><input class="ui-button-text" value="确定" type="submit"></span>
    </div>
</form>
```

JS

```js
seajs.use(['js/6v/lib/icbu/validator/validator.js', '$'], function(Validator, $) {
    $(function() {
        var validator = new Validator({
            element: 'form'
        });

        validator.addItem({
            element: '[name=username]',
            required: true,
            rule: 'email minlength{min:1} maxlength{max:20}'
        })

        .addItem({
            element: '[name=password]',
            required: true,
            rule: 'minlength{min:5}'
        })

        .addItem({
            element: '[name=password-confirmation]',
            required: true,
            rule: 'confirmation{target: "#password"}'
        });
    });
});
```

### 事件

### showMessage

渲染显示错误框之后触发事件

返回参数对象如下：

- `element` {dom}

    错误对象。

- `errorElement` {dom}

    出错提示框。