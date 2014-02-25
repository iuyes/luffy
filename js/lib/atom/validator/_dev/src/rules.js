// #require "./i18n/en-us.js"
// #require "./i18n/zh-cn.js"
// #require "./i18n/zh-tw.js"
// #require "./i18n/ko-kr.js"
// #require "./i18n/ar-sa.js"
// #require "./i18n/ja-jp.js"
// #require "./i18n/it-it.js"
// #require "./i18n/de-de.js"
// #require "./i18n/ru-ru.js"
// #require "./i18n/fr-fr.js"
// #require "./i18n/pt-pt.js"
// #require "./i18n/es-es.js"

/**
 * @author : nuo.xun 许诺
 */
define(function(require, exports, module) {
	
	var Core = require('arale-validator-core'),
        TextareaErrorFocus = require('atom/textarea-error-focus/textarea-error-focus'),
        Template = require('templatable'),
        tpl = require('./rule-errorchar.tpl'),
        // en-us | zh-cn | zh-tw | ko-kr | ar-sa | ja-jp | it-it | de-de | ru-ru | fr-fr | pt-pt | es-es
        i18nStr = './i18n/{locale}',
        i18n = require(i18nStr) || require('./i18n/en-us'),
        cTpl = Template.compile(tpl, i18n.ruleErrorChar);

	Core.addRule('errorchar', function( opts ){

                var _self = this,
                    errorRegx = /[^\u0000-\u00FF\u2103\u0424\u2030\u200B\u2013\u2022\u2026\u200E\u2264\u2265\u03C6\u2116\uFF1A\u2033\u2019\u2122\u0131\u20AC]+/g,
                    focusTimeoutId = null,
                    btweenMouseUpDownFlag = false
                    ;

                // 是否覆写校验正则
                if( opts.errorRegx ){
                    if(typeof(opts.errorRegx) === 'string'){
                        errorRegx = eval(opts.errorRegx);
                    }else{
                        errorRegx = opts.errorRegx;
                    }
                }

                var element = opts.element,
                    testRes = errorRegx.test(opts.element.val());

                if( opts.element.get(0).tagName.toUpperCase() === 'TEXTAREA' && !element.data('textarea-error-focus-prepared') ){

                    _self.on('showMessage',function(args){

                        if(!args.element.data('textarea-error-focus-prepared'))return;

                        var element = args.element,
                            errorElement = args.errorElement,
                            textareaErrorFocusObj = args.element.data('textarea-error-focus-obj')
                            ;

                        if(textareaErrorFocusObj){
                            if( !element.data('is-focus-error-click') ){
                                textareaErrorFocusObj.validate();
                            }
                        }else{

                            // first inited.

                            var textareaErrorFocus = new TextareaErrorFocus({
                                element : args.element,
                                errorRegx : errorRegx
                            });

                            element.on('paste',function(){
                                textareaErrorFocus.validate();
                            });

                            errorElement.bind('selectstart.forFocusError',function(){
                                if(btweenMouseUpDownFlag){
                                    return false;
                                }
                            });

                            textareaErrorFocus.on('validate', function(args){

                                if(args.errorCount === 0)return;
                                
                                var validateResultElement = errorElement.find('[data-role=validate-result]'),
                                    focusErrorResultElement = errorElement.find('[data-role=focus-error-result]')
                                    ;

                                errorElement.find('[data-role=error-count]').html(args.errorCount);
                                errorElement.find('[data-role=focus-error]').show();

                                validateResultElement.show();
                                focusErrorResultElement.hide();
                                
                            });

                            // if event click target is focus error element then cancel blur validate
                            _self.delegateEvents(errorElement,'mousedown [data-role=focus-error]', function(ev) {
                                element.data('is-focus-error-click',true);
                                clearTimeout(focusTimeoutId);
                                focusTimeoutId = setTimeout(function(){
                                    textareaErrorFocus.focusError();
                                    element.data('is-focus-error-click',false);
                                },0);
                                btweenMouseUpDownFlag = true;
                            });

                            _self.delegateEvents(errorElement,'mouseup [data-role=focus-error]', function(ev) {
                                btweenMouseUpDownFlag = false;
                            });

                            textareaErrorFocus.on('focusError', function(args){
                                var validateResultElement = errorElement.find('[data-role=validate-result]'),
                                    focusErrorResultElement = errorElement.find('[data-role=focus-error-result]')
                                    ;

                                    if(args.errorCount === 1){
                                        errorElement.find('[data-role=error-count-wrap]').hide();
                                        errorElement.find('[data-role=focus-error]').hide();
                                    }else{
                                        errorElement.find('[data-role=error-count]').html(args.errorCount);
                                        errorElement.find('[data-role=error-index]').html(args.errorIndex);
                                    }

                                    focusErrorResultElement.show();
                                    validateResultElement.hide();

                            });

                            // validate now
                            textareaErrorFocus.validate();

                            args.element.data('textarea-error-focus-obj',textareaErrorFocus);
                            args.element.data('is-textarea-error-focus',true);

                        }

                    });

                    element.data('textarea-error-focus-prepared', true);

                }

                return !testRes;

            }, 
            cTpl
    );

});