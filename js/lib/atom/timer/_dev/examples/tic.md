# Tic

- order: 2

---


## 示例：监听跳秒事件

````html
当前页面所在的服务器时间：<span id="t-2"></span>
````

````js
seajs.use(['$', 'js/6v/lib/icbu/timer/tic.js'], function( $, tic ){

    // 设置为：从当前页面获取服务器时间
    tic.set('timeServer', '');

    // 更新展示时间的方法
    function refreshTime( timeStamp ){
        $('#t-2').text( new Date(timeStamp) );
    }

    // 每秒更新最新时间
    tic.onTic(function( nowTime ){
        refreshTime( nowTime );
    });
});
````

