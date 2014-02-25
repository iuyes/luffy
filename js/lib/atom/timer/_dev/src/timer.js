define(function(require, exports, module) {

    var $ = require('$'),
        Base = require('base'),
        timerServerMap = require('./time-server-map.js');

    var Timer = Base.extend({

        attrs : {

            timeServer : (function(){
                return timerServerMap[ location.host ];
            })(),

            cachedTimes : {
                serverTime : null,
                localTime  : null   
            },

            setupted : false,
            setUpDfd : $.Deferred(), // 不区分服务器时间与本地时间的setup流程状态
            serverTimeSetUpDfd : $.Deferred() // 获取服务器时间的流程状态
        },

        setup : function( callback, context ) {
            var self = this,
                timeServer = this.get('timeServer'),
                setUpDfd = this.get('setUpDfd');

            if ( !this.get('setupted') ) {

                this.set('setupted', true);

                if ( !timeServer && timeServer !== '' ) { // undefined, null
                    this._setUpByLocalTime();
                    setUpDfd.resolveWith( self );
                }
                else {
                    this._setUpByServerTime().done(function(){
                        self.get('serverTimeSetUpDfd').resolveWith( self );
                    }).fail(function(){
                        self._setUpByLocalTime();
                    }).always(function(){
                        setUpDfd.resolveWith( self );
                    });
                }
            }

            setUpDfd.done(function(){
                if(callback) {
                    callback.call( context || window, this._getTime() );
                }
            });

            return setUpDfd;
        },

        getTime : function( callback, context ){
            var setUpDfd = this._setUpDfd;
            if ( !setUpDfd ) {
                this.setup( callback, context );
            }
            else {
                setUpDfd.done(function(){
                    if(callback) {
                        callback.call( context || window, this._getTime() );
                    }
                });
            }
            return callback ? this : this._getTime();
        },

        _getTime : function(){
            var nowLocalTime = new Date().getTime(),
                cachedTimes = this.get('cachedTimes');

            // 调试模式
            if ( location.href.indexOf('timer-debug=true') != -1 ) {
                return Number( localStorage.getItem('timer-debug') ) + ( nowLocalTime - cachedTimes.localTime );
            }
            else {
                // 当前服务器时间 ＝ 获取时的服务器时间 ＋ 当前本地时间与获取时本地时间的时间差
                return cachedTimes.serverTime + ( nowLocalTime - cachedTimes.localTime );
            }
        },

        _setUpByLocalTime : function(){
            var t = new Date().getTime();
            this.set('cachedTimes', {
                serverTime       : t,
                localTime        : t   
            });
        },

        _setUpByServerTime : function(){
            var self = this,
                serverTime,
                localTime = new Date().getTime();

            return $.ajax({
                type  : 'HEAD',
                url   : this.get('timeServer'),
                cache : false
            }).done(function(text, status, xhr){

                serverTime = new Date( xhr.getResponseHeader('date') ).getTime();

                self.set('cachedTimes', {
                    serverTime       :  serverTime,
                    localTime        :  localTime   
                });
            });
        }

    });

    // 单例
    module.exports = new Timer();
});