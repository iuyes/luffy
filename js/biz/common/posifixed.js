/****ie6位置固定****/

define(function(require, exports, module) {
	var jQuery = require('../lib/jquery');	
	(function($){
		var browserisIe6 = function(){
			if(document.all){//是ie浏览器
				var us = navigator.userAgent;
				return (us.indexOf('MSIE 6.0')>0) ? true : false; 
			}
			return false;
		};
		$.fn.extend({toFixed:function(position){
			if(!!!browserisIe6()){
				return this;
			}else {
				return this.each(function(){
					var t = $(this);
					var id = t.get(0).id || ('fixed_'+parseInt(Math.random()*10000));
					var rect = {w:t.width(),h:t.height(),l:t.css('left'),r:t.css('right'),'t':t.css('top'),b:t.css('bottom')};
					if (rect.l != 'auto') rect.l = parseInt(rect.l);if (rect.r != 'auto') rect.r = parseInt(rect.r);
					if (rect.t != 'auto') rect.t = parseInt(rect.t);if (rect.b != 'auto') rect.b = parseInt(rect.b);
					var _pos = {left:rect.l,right:rect.r,top:rect.t,bottom:rect.b};
					_pos = $.extend(_pos,position);
					var css  = '<style type="text/css">.'+id+'-fixed {position:absolute;bottom:auto;right:auto;clear:both;';
					if(rect.l != 'auto' && rect.r != 'auto')//width auto change by clientwidth
						css += 'width:expression(eval(document.compatMode && document.compatMode==\'CSS1Compat\') ? documentElement.clientWidth  - '+ rect.l +' - ' + rect.r +' : document.body.clientWidth  - '+ rect.l +' - ' + rect.r +' );';
					if(rect.l == 'auto' && rect.r != 'auto')
						css += 'left:expression(eval(document.compatMode && document.compatMode==\'CSS1Compat\') ? documentElement.scrollLeft + (documentElement.clientWidth-this.clientWidth - ' + rect.r + ') : document.body.scrollLeft +(document.body.clientWidth-this.clientWidth - ' + rect.r + '));';
					else
						css += 'left:expression(eval(document.compatMode && document.compatMode==\'CSS1Compat\') ? documentElement.scrollLeft + ' + rect.l + ' : document.body.scrollLeft + ' + rect.l + ');';
					if(rect.t == 'auto' && rect.b != 'auto')
						css += 'top:expression(eval(document.compatMode && document.compatMode==\'CSS1Compat\') ? documentElement.scrollTop + (documentElement.clientHeight-this.clientHeight - ' + rect.b + ') : document.body.scrollTop +(document.body.clientHeight-this.clientHeight - ' + rect.b + '));';
					else
						css += 'top:expression(eval(document.compatMode && document.compatMode==\'CSS1Compat\') ? documentElement.scrollTop + ' + rect.t + ' : document.body.scrollTop + ' + rect.t + ');';
					css += '}</style>';
					$(css).appendTo('head');
					t.addClass(id+'-fixed');
				
				});
				
			}
	
	
		}});
	})(jQuery);
});