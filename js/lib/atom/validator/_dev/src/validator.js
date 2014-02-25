// #require "i18n/en-us.js"
// #require "i18n/zh-cn.js"
// #require "i18n/zh-tw.js"
// #require "i18n/es-es.js"
define(function(require, exports, module) {

	var $ = require('$'),
		Core = require('validator'),
		i18nStr = './i18n/{locale}',
		i18n = require(i18nStr) || require('./i18n/en-us'),

		errorTracker = require('./error-tracker'),

		uuid = 0,

		CACHE_ERROR_ID = '_validator-error-id',
		MESSAGE_ID_SUFFIX = '-validator-error',

		SERVER_ERRORMESSAGE = 'data-server-errormessage',
		CFG_SERVER_ERRORMESSAGE = 'serverErrormessage',

		coreSetMessage = Core.setMessage;

	// 实例的缓存
	var incs = [];

	// add custom rules.
	require('./rules.js');

	var Validator = Core.extend({

		_errorItems: null,
		_formValidateStart: false,

		attrs: {

			autoFocus: true,

			itemClass: 'ui-form-item',
			itemErrorClass: 'ui-form-item-error',

			inputClassSelector: '.ui-textfield, .ui-textarea, .ui-dropdown',
			inputErrorClass: 'ui-textfield-error', //'ui-feedback-error',
			errorParentSelector: '.ui-form-control',
			errorContentClass: 'ui-feedback-body',
			//errorTpl:'<div class="ui-form-help ui-feedback ui-feedback-addon"><div class="ui-feedback-content ui-feedback-error ui-feedback-body"></div></div>',
			errorTpl: '<p class="ui-form-help ui-feedback ui-feedback-addon ui-feedback-error ui-feedback-body"></p>',

			showMessage: function(message, element) {

				this._setErrorMessage(element, message).show();

				this.getItem(element).addClass(this.get('itemErrorClass'));

				if (element.attr('type') != 'radio' && element.attr('type') != 'checkbox') {
					element.addClass(this.get('inputErrorClass'));
				}

				// 渲染错误之后触发事件
				this.trigger('showMessage', {
					element: element,
					errorElement: this.getError(element)
				});

			},

			hideMessage: function(message, element) {
				var item = this.getItem(element),
				inputErrorClass = this.get('inputErrorClass'),
				errorElement = this.getError(element);

				if (errorElement) {
					errorElement.hide();
				}

				//去除输入控件的标红样式
				if (element.attr('type') != 'radio' && element.attr('type') != 'checkbox') {
					element.removeClass(inputErrorClass);
				}

				//如果整行元素没有出错情况则去除整行的出错样式，这主要是为了兼容一行内有多个输入控件的情况
				if (item.find(inputErrorClass).length == 0) {
					item.removeClass(this.get('itemErrorClass'));
				}

			}
		},

		// override 
		setup: function(){
			Validator.superclass.setup.call(this);

			// 缓存实例
			incs.push(this);
			errorTracker.bindEvents(Validator, this);
		},

		// override
		destroy: function(){
			for(var i = 0, l = incs.length; i < l; i++){
				if(this === incs[i]){
					break;
				}
			}

			// 删除缓存
			if(i != l){
				incs.splice(i, 1);
			}


			Validator.superclass.destroy.call(this);
		},

		addItem: function(cfg) {
			var tcfg = (!$.isArray(cfg) ? [cfg] : cfg);
			var ele, serverErrorMessage;

			Validator.superclass.addItem.call(this, cfg);

			for (var i = 0, ln = tcfg.length; i < ln; i++) {
				ele = $(tcfg[i].element);

				if (tcfg[i][CFG_SERVER_ERRORMESSAGE]) {
					serverErrorMessage = tcfg[i][CFG_SERVER_ERRORMESSAGE];
				} else {
					serverErrorMessage = ele.attr(SERVER_ERRORMESSAGE);
				}

				if (serverErrorMessage) {
					this.showMessage(serverErrorMessage, ele);
					this.trigger('serverErrormessage', ele, serverErrorMessage);
				}

			}
			return this;
		},

		showMessage: function(message, element) {
			this.get('showMessage').call(this, message, element);
		},

		hideMessage: function(message, element) {
			this.get('hideMessage').call(this, message, element);
		},

		getError: function(ele) {
			var errorId = this.getErrorId(ele);
			var error = $('#' + errorId);

			return error.length ? error: null;
		},

		_renderError: function(ele) {
			var error = $(this.get('errorTpl')),
			errorParent = ele.closest(this.get('errorParentSelector')).first();

			if (!errorParent.length) {
				errorParent = this.getItem(ele);
			}

			error.prop('id', this.getErrorId(ele)).hide().appendTo(errorParent);

			return error;
		},

		_setErrorMessage: function(ele, message) {
			var errorElement = this.getError(ele),
			contentClass,
			content;

			if (!errorElement) {
				errorElement = this._renderError(ele);
			}

			contentClass = this.get('errorContentClass');
			//content = errorElement.find('.'+ contentClass);
			content = errorElement;

			if (!content.length) {
				content = ele;
			}

			content.html(message);

			return errorElement;
		},

		getErrorId: function(ele) {
			if (ele.data(CACHE_ERROR_ID)) {
				return ele.data(CACHE_ERROR_ID);
			}

			var id = ele.prop('id');

			// 返回 eleId-validator-message 或者 _validator_auto-validator-message
			id = (id ? id: this._uuid()) + MESSAGE_ID_SUFFIX;

			//把生成的错误容器的id缓存到输入框的数据里
			ele.data(CACHE_ERROR_ID, id);

			return id;

		},

		_uuid: function() {
			++uuid;
			return '_validator_auto' + uuid;
		},

		getItem: function(ele) {
			ele = $(ele);
			var item = ele.closest('.' + this.get('itemClass'));

			return item;
		}
	});

	Validator.setMessage(i18n);

	// 引入
	errorTracker.init(Validator, incs);

	module.exports = Validator;
});

/* DUMMY2 */
