define(function(require, exports, module) {
	var Events = require('events');
	var enabled = false;


	// 绑定事件用
	var bindEvents = exports.bindEvents = function(Validator, inc){
		if(!enabled){
			return;
		}

		inc.on('itemValidated', function(error, message, element, ev){
			if(!enabled){
				return;
			}

			// 在非js触发的情况下，且出错的时候
			if(ev && error){
				Validator.trigger('itemErrorByUser', error, message, element, ev, this);
			}
		});

		inc.on('formValidated', function(error, result, element){
			if(!enabled){
				return;
			}
			
			Validator.trigger('formValidated', error, result, element, this);
		});
	};


	exports.init = function(Validator, incs){
		// 先混入 Validator 的 Events
		mixTo(Validator);


		Validator.enableTracker = function(){
			if(enabled){
				return;
			}
			enabled = true;
			

			// 再绑定事件
			for (var i = 0, l = incs.length; i < l; i++) {
				bindEvents(Validator, incs[i]);
			}
		};

		Validator.disableTracker = function(){
			enabled = false;
		};
	};    


	//----helper
	function mixTo(receiver){
		var proto = Events.prototype;

		for (var p in proto) {
			if (proto.hasOwnProperty(p)) {
				receiver[p] = proto[p];
			}
		}
	}
});