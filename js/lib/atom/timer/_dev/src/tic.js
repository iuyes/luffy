define(function(require, exports, module) {
    var $ = require('$'),
        timer = require('./timer.js');

    timer.TIC_EVENT = 'tic'; // 跳秒事件名

    timer.set('ticCache', {
        inited : false,
        focusingTimeout : null,
        fixOffsetTimeout : null,
        ticInterval : null,
        nowSecondTime : 0 // 精确到秒
    });

    // 设置（重置）跳秒定时器，每秒定时更新当前秒时间（nowSecondTime），并触发跳秒（tic）事件
    timer._resetTicInterval = function( ){
            
        var self = this,
            ticCache = this.get('ticCache'),
            nowTime = this.getTime(),
            secondOffset = 1000 - ( nowTime % 1000 ); // 距离最近一个整数秒的偏差

        ticCache.nowSecondTime = nowTime + secondOffset; // 从下一个整数开始倒计时

        // 消除旧的定时器
        clearTimeout( ticCache.fixOffsetTimeout );
        clearInterval( ticCache.ticInterval );

        ticCache.fixOffsetTimeout = setTimeout(function(){

            // 第一次跳秒
            self.trigger( self.TIC_EVENT, ticCache.nowSecondTime );

            // 启动跳秒定时器
            ticCache.ticInterval = setInterval(function(){
                ticCache.nowSecondTime += 1000;
                self.trigger( self.TIC_EVENT, ticCache.nowSecondTime );
            }, 1000);

        }, secondOffset );
    };


    timer._initTic = function(){

        var self = this,
            ticCache = this.get('ticCache');

        // 启动定时器
        this._resetTicInterval();


        // 若页面一直处于focus状态，则定时重启定时器，修正时间偏差（3分钟）
        clearTimeout( ticCache.focusingTimeout );
        ticCache.focusingTimeout = setTimeout(function(){
            self._resetTicInterval();
        }, 3*60*1000 );

        // 只做一次事件绑定 
        if ( !ticCache.inited ) {
            // 在浏览器窗口不可见状态取消时（从最小化、切换Tab、锁屏、休眠等状态中恢复），重启定时期，修正时间偏差
            // 同时清除一直focus的计时器
            $(window).on('focus', function(){
                self._resetTicInterval();
                clearTimeout( ticCache.focusingTimeout );
            }); 
        }

        ticCache.inited = true;
    };


    timer.onTic = function( callback, context ){

        this.on( this.TIC_EVENT, callback, context );

        // 立即执行一次回调，将开始时间提前至未完成的半秒
        function firstShow() {
            if ( callback ) {
                var nowTime = this._getTime(),
                    ticStartTime = nowTime - 1000 + ( nowTime % 1000 );
                callback.call( context || window, ticStartTime );   
            }
        }

        if ( !this.get('inited') ) {
            this.set('inited', true);
            this.setup(function(){
                this._initTic();
                // 立即执行一次回调
                firstShow.call( this );
            }, this);
        }
        else {
            // 立即执行一次回调
            firstShow.call( this );
        }
        return this;
    };


    timer.offTic = function( callback, context ){
        this.off( this.TIC_EVENT, callback, context );
        return this;
    };

    module.exports = timer;
});