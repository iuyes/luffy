define(function(require, exports, module) {
	var $ = require('$');
	var AraleSelect = require('arale/select/0.9.7/select');

	var Select = AraleSelect.extend({
		attrs: {
			triggerTpl: require('./trigger.tpl'),
			template: require('./select.tpl'),

			// 置空
			classPrefix: ''
		},

		events: {
			'mouseenter [data-role=item]': function(ev) {
				this.$('.selected').removeClass('selected');
			}
        },

		setup: function() {
			Select.superclass.setup.call(this);

			this.before('show', function(){
				var selected = this.options.eq(this.get('selectedIndex'));

				if(selected){
					// 先取消 class，再赋值
					this.$('.selected').removeClass('selected');

					selected.addClass('selected');
				}
			});
		},

		// 保持 menu 于 trigger 的宽度
		_setTriggerWidth: function () {},

		// ui
		_onRenderVisible: function(val){
			Select.superclass._onRenderVisible.apply(this, arguments);

			// 追加 opened 状态的class
			this.get('trigger').toggleClass('opened', val);
		},

		_onRenderDisabled: function(val) {
			this.get('trigger').toggleClass('disabled', val);

			// trigger event
			var selected = this.options.eq(this.get('selectedIndex'));
			this.trigger('disabledChange', selected, val);
		}
	});

	module.exports = Select;
});