# Timer

- order: 1

---


## 示例一：获取当前时间，只获取一次

````html
当前页面所在的服务器时间：<span id="t-1"></span>
````

````js
seajs.use(['$', 'js/6v/lib/icbu/timer/timer.js'], function( $, timer ){

    // 设置为：从当前页面获取服务器时间
    timer.set('timeServer', '');

    // 获取时间
    timer.getTime(function( nowTime ){
        $('#t-1').text( new Date(nowTime) );
    });
});
````




## 示例二：一次回调，多次同步获取

````html
当前页面所在的服务器时间：<span id="t-2"></span>
<button id="update-t">点我获取最新时间</button>
````

````js
seajs.use(['$', 'js/6v/lib/icbu/timer/timer.js'], function( $, timer ){

    // 设置为：从当前页面获取服务器时间
    timer.set('timeServer', '');

    // 更新展示时间的方法
    function refreshTime( timeStamp ){
        $('#t-2').text( new Date(timeStamp) );
    }

    // 获取时间
    timer.setup(function( nowTime ){
        // 第一次更新展示时间
        refreshTime( nowTime );
        // 点击按钮时更新展示时间
        $('#update-t').click(function(){
            refreshTime( timer.getTime() );
        });
    });
});
````

