define(function(require, exports, module) {

    var $ = require('$'),
        tic = require('./tic.js'),
        Widget = require('widget');

    var CountDown = Widget.extend({

        attrs : {

            // Elements
            dayElement : {
                value : '[data-role="day"]',
                getter: function(val) {
                    return this.$(val);
                }
            },

            hourElement : {
                value : '[data-role="hour"]',
                getter: function(val) {
                    return this.$(val);
                }
            },

            minuteElement : {
                value : '[data-role="minute"]',
                getter: function(val) {
                    return this.$(val);
                }
            },

            secondElement : {
                value : '[data-role="second"]',
                getter: function(val) {
                    return this.$(val);
                }
            },

            // 展示格式自定义
            remainingFormater : {
                day    : function( val ) { return val; },
                hour   : function( val ) { return val < 10 ? ('0' + val) : val; },
                minute : function( val ) { return val < 10 ? ('0' + val) : val; },
                second : function( val ) { return val < 10 ? ('0' + val) : val; }
            },

            remainings : {
                day    : 0,
                hour   : 0,
                minute : 0,
                second : 0
            },

            deferred : null,

            startTime : null,
            targetTime : null,
            timeRemaining  : null
        },

        initialize : function( conf ){

            this.initAttrs(conf);

            // 记录非UI倒计时
            if ( !this.element ) {
                this.withoutElement = true;
            }
            this.parseElement();

            // 根据UI节点配置情况，生成获取剩余时间的方法
            this._resetGetRemainingFuncs();

            // 初始化异步流程对象
            this.set('deferred', $.Deferred());

            // 获取到当前时间，设置目标时间
            tic.getTime(function( nowTime ){
                var targetTime = this.get('targetTime');
                this.set('startTime', nowTime);
                this.set('targetTime', this._getTargetDateTime( nowTime, targetTime ) );
            }, this)

            // 绑定跳秒事件，开始倒计时
            .onTic( this._ticHandler, this );

            // 停止倒计时时解除跳秒事件绑定
            var self = this;
            this.get('deferred').fail(function(){
                tic.offTic( self._ticHandler, self );
            });

            return this;
        },

        done : function(  ){
            return this.get('deferred').done.apply( this.get('deferred'), arguments );
        },

        progress : function(  ){
            return this.get('deferred').progress.apply( this.get('deferred'), arguments );
        },

        fail : function(  ){
            return this.get('deferred').fail.apply( this.get('deferred'), arguments );
        },

        reject : function(  ){
            return this.get('deferred').reject.apply( this.get('deferred'), arguments );
        },

        pipe : function(  ){
            return this.get('deferred').pipe.apply( this.get('deferred'), arguments );
        },

        _getTargetDateTime : function( nowTime, tar ){

            // 目标时间若为数字，则认为是时间戳格式，不作改变
            if ( $.type( tar ) == 'number' ) {

            }
            // 若为字符串，则作为date格式的字符串处理
            else if ( $.type( tar ) == 'string' ) {
                tar = new Date(tar).getTime();
            }
            // 若为Date对象
            else if ( $.type( tar ) == 'data' ) {
                tar = tar.getTime();
            }
            // 若为自定义方法
            else if ( $.type( tar ) == 'function' ) {
                tar = tar( nowTime );
            }

            return Number(tar);
        },

        _ticHandler : function( nowTime ){
            var deferred = this.get('deferred'),
                timeRemaining = this.get('targetTime') - nowTime,
                ended = false;


            if ( timeRemaining < 0 ) {
                ended = true;
                timeRemaining = 0;
            }

            if ( !this.withoutElement ) {
                var remainingFormater = this.get('remainingFormater'),
                    remainings = {},
                    elements = {
                        day    : this.get('dayElement'),
                        hour   : this.get('hourElement'),
                        minute : this.get('minuteElement'),
                        second : this.get('secondElement')
                    };

                for( var elName in elements ) {
                    var el = elements[ elName ],
                        formater = remainingFormater[ elName ],
                        remain = remainings[ elName ] = this['_' + elName + 'Remaining']( timeRemaining );
                    if ( el && el.length ) {
                        el[0].innerHTML = ( typeof formater == 'function' ? formater( remain ) : remain );
                    }
                }
                this.set('remainings',remainings);
            }

            this.set('timeRemaining', timeRemaining);

            deferred.notifyWith( this, [ timeRemaining ] );

            if( ended ) {
                deferred.resolveWith( this );
                tic.offTic( this._ticHandler, this );
            }
        },

        // 根据UI节点配置情况，设置相应的倒计时时间计算方法
        _resetGetRemainingFuncs : function(){

            var dayVal = 'Math.floor( timeRemaining / ' + ( 1000 * 3600 * 24 ) + ' )';
            var houVal = 'Math.floor( ( timeRemaining / ' + ( 1000 * 3600 ) + ' ) % 24 )';
            var minVal = 'Math.floor( ( timeRemaining / ' + ( 1000 * 60 ) + ' ) % 60 )';
            var secVal = 'Math.floor( ( timeRemaining / 1000 ) % 60 )';
            var els = {
                day    : this.get('dayElement'),
                hour   : this.get('hourElement'),
                minute : this.get('minnuteElement'),
                second : this.get('secondElement')
            };

            // 若天数容器是DOM节点，那么一切正常...
            if( els.day && els.day.length > 0  ) {

            }
            // 若天数容器不是DOM节点，而小时容器是DOM节点，则将天数加入到小时数中
            else if( els.hour && els.hour.length > 0 ) {
                houVal  = 'Math.floor( timeRemaining / ' + ( 1000 * 60 * 60 ) + ' )';
            }
            // 若天数容器和小时容器不是DOM节点，而分钟容器是DOM节点，则将天数和小时数加入到分钟数中
            else if( els.minute && els.minute.length > 0 ) {
                minVal = 'Math.floor( timeRemaining / ' + ( 1000 * 60 ) + ' )';
            }
            // 若天数容器、小时容器和分钟容器不是DOM节点，而秒容器是DOM节点，则将天数、小时和分钟数加入到秒数中
            else if ( els.second && els.second.length > 0 ){
                secVal = 'Math.floor( timeRemaining / 1000 )';
            }

            // 设置相应的剩余时间计算方法
            this._dayRemaining    = new Function( 'timeRemaining', 'return ' + dayVal + ';' );
            this._hourRemaining   = new Function( 'timeRemaining', 'return ' + houVal + ';' );
            this._minuteRemaining = new Function( 'timeRemaining', 'return ' + minVal + ';' );
            this._secondRemaining = new Function( 'timeRemaining', 'return ' + secVal + ';' );
        }
        
    });

    module.exports = CountDown;
});