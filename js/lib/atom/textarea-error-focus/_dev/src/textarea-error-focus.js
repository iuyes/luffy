/*
 *@name : TextareaErrorFocus
 *@description : 文本框高亮选取功能
 *@author : nuo.xun@alibaba-inc.com
 *@version : 1.0
 */
define(function(require, exports, module) {

	var 
		// requires
		$ = require('$'),
		Widget = require('widget'),
		highlightFocus = require('./highlight-focus');



	var TextareaErrorFocus = Widget.extend({

		attrs : {
			element : {
				value: '#demo-textarea',
				setter: function(el){
					return $(el);
				}
			},

			errorRegx : /[^\u0000-\u00FF\u2103\u0424\u2030\u200B\u2013\u2022\u2026\u200E\u2264\u2265\u03C6\u2116\uFF1A\u2033\u2019\u2122\u0131\u20AC]+/g,

			highLightClassName : 'high-light-focus'

		},

        _errorIndex : 0,
        _indexOfStartPos : 0,
        _regResult : [],
        _isClickedResetPos : false,

        setup : function(args){
			
			var _self = this,
				element = this.get('element');

			element.on('click', function(ev) {
				_self._seekFromCurrentCaret();
			});

			element.on('keyup', function(ev) {

		    	// if delete key code
		        if(ev.keyCode === 8){
		            _self._seekFromCurrentCaret();
		        }

			});

		},

		validate : function(){

		    var regx = this.get('errorRegx'),
		    	element = this.get('element'),
		        textareaVal = element.val(),
		        regResult = textareaVal.match(regx),
		        res = { errors : [], errorCount : 0 }
		        ;

		        if(regResult){
			        // validateResult
			        res = { errors : regResult, errorCount : regResult.length };
		        }

		        this.trigger('validate',res);
		        return res;
		},

		focusError : function(){

		    var regx = this.get('errorRegx'),
		    	element = this.get('element'),
		    	errorIndexEl = this.get('errorIndexEl'),
		    	highLightClassName = this.get('highLightClassName');


		        var textareaVal = element.val(),
		            allRegResult = textareaVal.match(regx);

		        if(!allRegResult){
		            return;
		        }

		        // rematch
		        if(!this._isClickedResetPos){
		            this._regResult = textareaVal.match(regx);
		        }

		        // get error.
		        if( this._regResult && this._regResult.length > 0){

		            // rematch reset.
		            if( this._errorIndex > this._regResult.length - 1){
		                this._errorIndex = 0;
		            }

		            // get start and end postion.
		            var startPos = textareaVal.indexOf(this._regResult[this._errorIndex],this._indexOfStartPos),
		                endPos = startPos + this._regResult[this._errorIndex].length,
		                currentIndex = this._errorIndex + 1 + allRegResult.length - this._regResult.length
		            ;

		            // next time indexOf from here.
		            this._indexOfStartPos = endPos;

		            // highlight it!
					highlightFocus({
						element : element.get(0),
						start : startPos,
						end : endPos,
				        // highlight add class name.
				        highLightClassName   : highLightClassName
					});

			        // trigger focusError
			        this.trigger('focusError',{ errors : allRegResult, errorCount : allRegResult.length, errorIndex : currentIndex, firstErrorStartPos: startPos, firstErrorEndPos: endPos });

			        // ga get errors
					if(typeof _gaq !== 'undefined'){
						try{
							_gaq.push(['_trackEvent', 'textarea-error-focus', 'errors', allRegResult.join(',') + '|' + escape( allRegResult.join(',') ).replace(/%2C/g,',') ]);
						}catch(e){}
					}

		            // make this loop.
		            if( this._errorIndex === this._regResult.length - 1 ){
		                this._errorIndex = 0;
		                this._indexOfStartPos = 0;
		                this._isClickedResetPos = false;
		            }else{
		                this._errorIndex++;
		            }
		        }

		},


	    // seek from current caret position. help search nearly one.
	    _seekFromCurrentCaret : function(){
	    	var regx = this.get('errorRegx'),
	    		element = this.get('element');
	    	
	        // get position.
	        var caretPos = _getCaretPos(element.get(0)),
	            textareaVal = element.val().substr(caretPos,element.val().length);

	        // rematch
	        this._regResult = textareaVal.match(regx);
	        if(this._regResult){
	            this._indexOfStartPos = caretPos - 1;
	            // click reset pos , form click pos seek next target.
	            this._isClickedResetPos = true;
	        }else{
	            this._indexOfStartPos = 0;
	            this._isClickedResetPos = false;
	        }

	        this._errorIndex = 0;
	    }


	});

    //-------------------- helper -------------------//
    // get current caret position.
    var _getCaretPos = function(el) { 
      if ( el.selectionStart ) {
        return el.selectionStart;
      }else if( document.selection ){
        el.focus();
        var r = document.selection.createRange();
        if( r == null ){
          return 0;
        }
        var re = el.createTextRange(),
            rc = re.duplicate();
        re.moveToBookmark(r.getBookmark());
        rc.setEndPoint('EndToStart', re);
        return rc.text.length;
      }
      return 0;
    };

    //-------------------- exports -------------------//
	module.exports = TextareaErrorFocus;

});