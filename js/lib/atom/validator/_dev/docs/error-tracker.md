# ErrorTracker

-order: 2

-----

内置了一套错误获取事件机制，可以通过自定义事件的方式获取校验错误的情况

## 最佳实践

```js
seajs.use(['js/6v/lib/icbu/validator/validator.js', '$'], function(Validator, $) {
    // 开启错误捕获
    Validator.enableTracker();

    // 监听用户操作（UI）导致的单项item错误事件
    Validator.on('itemErrorByUser', function(error, message, element, ev, inc){
        console.log(arguments);
    });

    // 监听每次 submit 的情况
    Validator.on('formValidated', function(error, result, element, inc){
        console.log(arguments);
    });
});
```

## 方法

### enableTracker()

开启捕获

### disableTracker()

关闭捕获

## 事件

### itemErrorByUser

用户触发的（blur，click等）单项 item 校验出错时触发

### formValidated

表单校验完毕时触发