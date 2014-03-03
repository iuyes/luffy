/**图片延时加载***/
define(function(require, exports, module) {
	
	var $ = require('$');
	
	var ImagesLazyload = function(){
		this.config = {
			target:[document],// 处理容器 默认整个文档
			mod:"auto",// 惰性处理模式 [auto | manual | once]
			diff:"default",// 当前视窗往下，diff px 外的图片延迟加载
			placeholder	:'../../../css/images/app/imagelazyload/ico-imageloading.gif',	// 被替换成的微图
			imageSrcAttr: "image-src",//手动manual模式将把此属性值付给src
			callBack:null//当该实例所有图片加载完成时的回调函数
		};
		
		this.cache = {
			images:null
		}
		return this;
	};
	
	ImagesLazyload.prototype = {
	    /**
	     * 获取阈值
	     * @protected
	     */
	    _getThreshold: function() {
	        var diff = this.config.diff;
			var h1 = document.body && document.body.clientHeight ? document.body.clientHeight : 0 ;
			var h2 = document.documentElement && document.documentElement.clientHeight? document.documentElement.clientHeight :0;
		
			var ret = Math.min(h1,h2);
	        if(diff === "default") {
	        	return 2*ret;
	        }else {
	        	return ret + diff;
	        }
	        
	    },
	    /**
	     * 初始化加载事件
	     * @protected
	     */
	    _initLoadEvent: function() {
	        var timer, _self = this;
	        //只触发一次，由mouseover事件触发
	        if(this.config.mod === "once"){
	        	// 加载一次
		        function loaderOnce(){
		      		loader(true);
		      		$('document').unbind('mouseover',loaderOnce);
		      	}
	        	$('document').bind('mouseover',loaderOnce);
	        	
	        }else{
	        	// scroll 和 resize 时，加载图片
		        $(window).bind('scroll',function(){
		        	loader(true);
		        });

		        function loaderResize(){
		        	_self.threshold = _self._getThreshold();
		          	_self._loadImgs(true);
		        }
		        $(window).bind('resize', loaderResize);
				
		        // 手工模式时，第一屏也有可能有 data-src 项
		        if(this.config.mod === "manual") {
		            // 需要立即加载一次，以保证第一屏图片可见
		            _self._loadImgs(true);
		        }
	        }
	        
	        // 加载函数
	        function loader(force) {

	            if(timer) return;
	            timer = setTimeout(function() {
	                _self._loadImgs(force);
	                if (_self.images.length === 0) {
	                		if(_self.config.mod !== "once"){
		                     $(window).unbind('resize', loaderResize)
		                 	 $(window).unbind('scroll',loader)	
		                  }
	                    //执行回调函数
	                    if(typeof _self.config.callBack == 'function'){
	                    	_self.config.callBack();
	                    }
	                }
	                else if(_self.config.mod === "once"){
	                	timer = null;
	                	loader(true);
	                	return;
	                }
	                timer = null;
	            }, 100); // 0.1s 内，用户感觉流畅
	        }
	    },
	
	    /**
	     * 获取并初始化需要延迟下载的图片
	     * @protected
	     */
	    _filterImgs: function() {
	        var containers = this.config.target,
	            threshold = this.threshold,
	            placeholder = this.config.placeholder,
	            isManualMod = this.config.mod === "manual" || this.config.mod === "once",
	            n, N, imgs, i, len, img, data_src,
	            DATA_SRC = this.config.imageSrcAttr,
	            ret = [];
	
	        for (n = 0, N = containers.length; n < N; ++n) {
	            imgs = containers[n].getElementsByTagName("img");
	
	            for (i = 0, len = imgs.length; i < len; ++i) {
	                img = imgs[i];
	                data_src = $(img).attr(DATA_SRC);
	
	                if (isManualMod) { // 手工模式，只处理有 data-src 的图片
	                    if (data_src) {
	                        //img.src = placeholder;
	                        ret.push(img);
	                    }
	                } else { // 自动模式，只处理 threshold 外无 data-src 的图片
	                    // 注意：已有 data-src 的项，可能已有其它实例处理过，重复处理
	                    // 会导致 data-src 变成 placeholder

	                    if ($(img).offset().top > threshold && !data_src) {
	                        $(img).attr(DATA_SRC, img.src);
	                        img.src = placeholder;
	                        ret.push(img);
	                    }
	                }
	            }
	        }
	        return ret;
	    },
	
	    /**
	     * 加载图片
	     * @protected
	     */
	    _loadImgs: function(force) {
			var S1t = document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop :0;
			var S2t = document.body && document.body.scrollTop ? document.body.scrollTop :0;
	        var scrollTop = Math.max(S1t,S2t);
	        if(!force && scrollTop <= this.config.diff) return;
	        var imgs = this.images,
	            threshold = this.threshold + scrollTop,
	            i, img, data_src, remain = [],
	            DATA_SRC = this.config.imageSrcAttr
	        ;
			
	        for(i = 0, img; img = imgs[i++];) {

	            if($(img).offset().top <= threshold) {
	                data_src = $(img).attr(DATA_SRC);
	                // 显示图片
	                if($(img).css('visibility') == "hidden"){
	                	$(img).bind('load',function(){
	                		$(img).css('visibility','visible')
	                	})

	                };
	                
	                if(data_src && img.src != data_src) {
	                    img.src = data_src;
	                    $(img).removeAttr(DATA_SRC)
	                }
	                
	            } else {
	                remain.push(img);
	            }
	        }
	
	        this.images = remain;
	    },
	
			/**
			* 初始化
			* @param {Object} customConfig - 自定义覆写Config
			* @return {Object} - 自身元素
			**/
		init : function(customConfig){
			$.extend(this.config,customConfig || {});
			
			var _self = this,config = this.config,temp = this.temp;
			
		    _self.threshold = _self._getThreshold();
		    
		    _self.images = _self._filterImgs();
		     this.cache.images = _self.images;
		    

		    if (_self.images.length > 0) {
		        _self._initLoadEvent();
		    }

			if(document.all){ 
				CollectGarbage(); 
			}
			return _self;
		}
	 
	};
	
	return ImagesLazyload;

});