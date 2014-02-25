# Count Down

- order: 3

---

## 示例一：倒计时至某个时间点（服务器时间）

````html
<p id="cd-1">
    距离2014年1月1日还有: 
    <span data-role="day"></span>天
    <span data-role="hour"></span>小时
    <span data-role="minute"></span>分
    <span data-role="second"></span>秒
</p>
````

````js
// 实例化倒计时
seajs.use('js/6v/lib/icbu/timer/count-down.js', function( CountDown ){
    new CountDown({
        element: '#cd-1',
        targetTime: '2014/1/1 00:00:00 GMT+0800',
        timeServer: ''   // 请求当前页面获取服务器时间
    });
});
````


## 示例二：倒计时至某个自定义时间点

````html
<p id="cd-2">
    距离＋8时区今天下午6点还剩：
    <span data-role="hour"></span>小时
    <span data-role="minute"></span>分
    <span data-role="second"></span>秒
</p>
````

````js
// 定义一个根据当前时间计算＋8时区今天下午6点的方法
function getToday6pmTime( nowTime ) {
    var GMT8today = new Date( nowTime + 8*60*60*1000 );
    var targetDate = new Date([ 
        [
            GMT8today.getUTCFullYear(), 
            GMT8today.getUTCMonth() + 1, 
            GMT8today.getUTCDate()
        ].join('/'),
        '18:0:0',
        'GMT+0800'
    ].join(' '));
    return targetDate.getTime();
}
````

````js
// 实例化倒计时
seajs.use('js/6v/lib/icbu/timer/count-down.js', function( CountDown ){
    new CountDown({
        element: '#cd-2',
        targetTime: function( nowTime ){
            // targetTime参数可通过传入function实现自定义目标时间
            // 该方法的参数nowTime即当前时间，方法返回值为计算后得到的目标时间
            return getToday6pmTime( nowTime );
        }
    });
});
````

## 示例三：通过remainingFormater参数，实现自定义输出格式

````html
<p id="cd-3">
    距离2014年1月1日还有: 
    <span data-role="day"></span> 天，
    <span data-role="hour"></span> 小时，
    <span data-role="minute"></span> 分，
    <span data-role="second"></span> 秒
</p>
````

````js
// 定义一个将阿拉伯数据转为中文数字的方法
var zhText = [ '零', '一', '二', '三', '四', '五', '六', '七', '八', '九' ];
var unitText = [ '', '十', '百', '千', '万' ];
function numToZh( num ){
    var res = (num + '').split('');
    for( var i=0; i < res.length ; i++ ) {
        res[i] = zhText[ res[i] ] + ( unitText[ res.length - 1 - i ] || '' );
    }
    return res.join('');
}
````

````js
// 实例化倒计时
seajs.use('js/6v/lib/icbu/timer/count-down.js', function( CountDown ){
    new CountDown({
        element: '#cd-3',
        targetTime: '2014/1/1 00:00:00 GMT+0800',
        timeServer: '',  // 请求当前页面获取服务器时间

        // 通过传入remainingFormater参数设置内容输出格式
        remainingFormater : {
            day    : function( val ){ return numToZh( val ); },
            hour   : function( val ){ return numToZh( val ); },
            minute : function( val ){ return numToZh( val ); },
            second : function( val ){ return numToZh( val ); }
        }
    });
});
````


## 示例四：倒计时完成事件

````html
<p>
    20秒后右边的数字变成"done"：<span id="cd-4"> <span data-role="second"></span>秒 </span>
</p>
````
````js
// 实例化倒计时
seajs.use(['$', 'js/6v/lib/icbu/timer/count-down.js'], function( $, CountDown ){
    new CountDown({
        element: '#cd-4',
        targetTime: function( nowTime ){ return nowTime + 20000; }

    }).done(function(){
        $('#cd-4').html('done');
    });
});
````



## 示例五：跳秒事件监听

````html
<p id="cd-5">
    距离＋8时区今天下午6点还剩：
    <span data-role="hour"></span>小时
    <span data-role="minute"></span>分
    <span data-role="second"></span>秒
    <br>
    （同时文字每十秒闪烁一次）
</p>
````
````js
// 定一个让文本闪烁的方法
function flickText( node ) {
    node.css('color', 'red');
    setTimeout(function(){
        node.css('color', '');
    }, 1000);
}
````
````js
// 实例化倒计时
seajs.use(['$', 'js/6v/lib/icbu/timer/count-down.js'], function( $, CountDown ){
    new CountDown({
        element: '#cd-5',
        targetTime: function( nowTime ){ return getToday6pmTime( nowTime ); }

    }).progress(function( remaining ){
        if ( remaining % 10000 == 0 ) {
            flickText( $('#cd-5') );
        }
    });
});
````


