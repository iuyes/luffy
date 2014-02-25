/*
 *@name : highlightFocus
 *@description : 文本框高亮选取功能
 *@author : nuo.xun@alibaba-inc.com
 *@version : 1.0
 */
define(function(require, exports, module) {

	var 
		// requires
		$ = require('$')
	;

	var highlightFocus = function(customConfig) {

		// default config.
		var config = {
			// target element
			element : null,
			// start position
			start : 0,
			// end position
			end : 0,
			// highlight add class name.
			highLightClassName	 : 'high-light-focus',
			// adjust focus highlight line (except IE).
			adjustLineHeight : '15px',
			// focus rise rows
			focusRiseRows : 3
		},

		// config
		config = $.extend(config, customConfig || {});

		var $element = $(config.element),
			element = $element.get(0),
			start = config.start,
			end = config.end
		;

		// error is no element matched
	    if (!$element || !$element[0]) {
	       throw new Error('element is invalid');
	    }

		if (element.setSelectionRange) {
			element.setSelectionRange(start, end);
			if(element.scrollHeight > element.offsetHeight){
				_scrollToHighlight({
					el : element,
					end : end,
					adjustLineHeight : config.adjustLineHeight,
					focusRiseRows : config.focusRiseRows
				});
			}
		} else if (element.createTextRange) {
			var range = element.createTextRange();
			range.collapse(true);
			range.moveEnd('character', end);
			range.moveStart('character', start);
			range.select();
		}
		// focus
		element.focus();
		// add high light focus class.
		$element.addClass(config.highLightClassName);
		// click it remove highlight class.
		$element.one('mousedown',function(){
			$element.removeClass(config.highLightClassName);
		});

		return true;

	},

	_scrollToHighlight = function(args){
		var $el = $(args.el),
			$elParnet = $el.parent(),
			tempInnerText = $el.val().substr(0,args.end),
			// create dom to measure textarea height.
			$measureDiv = $("<textarea>",{
				value  : tempInnerText
			// copy textarea styles.
			}).css({
				position : 'absolute',
				left : -100000,
				overflowY : 'scroll',
				width  :  $el.width(),
				height : 1,
				font : $el.css('font'),
				padding : $el.css('padding')
			}).appendTo( $elParnet );

		// begin scroll. and rise in x rows.
		$el.scrollTop($measureDiv.prop('scrollHeight') - ( parseInt(args.adjustLineHeight,10) * args.focusRiseRows ) );
		// remove measure dom.
		$measureDiv.remove();
	};

	// exports
	module.exports = highlightFocus;

});