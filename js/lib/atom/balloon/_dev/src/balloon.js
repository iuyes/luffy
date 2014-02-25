 define(function(require, exports, module) {
	var $ = require('$'),
		Popup = require('popup'),
		Templatable = require('templatable'),
		
		//ALIGN_ELEMENT = 'alignElement',
		DISTANCE = 'distance',
		ARROW_POSITION = 'arrowPosition',
		ALIGN_TYPE = 'alignType',
		OFFSET = 'offset',
		IN_VIEWPORT = 'inViewport',
		
		// 方向map
		positionMap = {
			'tl': 'tl',
			'tr': 'tr',
			'rt': 'rt',
			'rb': 'rb',
			'br': 'br',
			'bl': 'bl',
			'lb': 'lb',
			'lt': 'lt'
		},
		// 根据箭头的高宽产生的数字
		defaultArrowShift = 17,
		
		// class前缀
		classPrefix = 'ui-balloon-',
		
		ATTRS = {},
		
		Balloon;
	
	/**
	 * 重写基类的默认值
	 *
	 * @attribute distance
	 * @type Number
	 * @default 10
	 */
	ATTRS[DISTANCE] = 10;
	
	/**
	 * 箭头位置，可选[tl|tr|rt|rb|br|bl|lb|lt]，默认lt！dom由data-role="arrow"指定。
	 *
	 * @attribute arrowPosition
	 * @type String
	 * @default 'lt'
	 */
	ATTRS[ARROW_POSITION] = {
		value: 'lt',
		setter: function(val){
			return positionMap[val] || 'lt';
		}
	};
	
	/**
	 * balloon的对齐方式，可选[arrow|line]，默认为arrow，具体的对齐与arrowPosition有关
	 * - arrow: 箭头的中点与trigger的中点对齐
	 * - line: balloon的边与trigger的边对齐
	 *
	 * @attribute alignType 
	 * @type String
	 * @default 'arrow'
	 */
	ATTRS[ALIGN_TYPE] = {
		value: 'arrow',
		setter: function(val){
			if(val != 'arrow' && val != 'line'){
				val = 'arrow';
			}
			
			return val;
		}
	};
	
	/**
	 * 如果以上的对齐方式不能满足你，可以用这个做微调，尽量不使用！，默认[0,0]
	 *
	 * @attribute offset
	 * @type Array
	 * @default [0, 0]
	 */
	ATTRS[OFFSET] = {
		value: null,
		getter: function(val){
			return val || [0, 0];
		}
	};
	
	/**
	 * 在show的时候如果在屏幕外，是否要自动转换到屏幕内，默认为false
	 *
	 * @attribute inViewport
	 * @type Boolean
	 * @default false
	 */
	ATTRS[IN_VIEWPORT] = false;
	
	// 原属性
	ATTRS.direction = 'up';
	
	// 默认模板，尽量不要覆盖
	ATTRS.template = require('./balloon.tpl');
	
	// UI相关的属性
	ATTRS.content = '';
	ATTRS.title = '';
	ATTRS.hasCloseX = false;
	
	
	Balloon = Popup.extend({
		
		Implements: [Templatable],
		
		attrs: ATTRS,
		
		events: {
			'click [data-role="close"]': 'hide'
		},
		
		// 子类初始化
		setup: function() {
			// 保存下原始的方向
			this._originArrowPosition = this.get(ARROW_POSITION);
			
			
			// 需要静态定位时，不需要事件绑定
			// TODO: 这种做法有点野蛮，看看能不能优化下
			if(this.get('triggerType') == 'none'){
				this._bindTrigger = this._blurHide = function(){};
			}
			
			Balloon.superclass.setup.call(this);            
		},
		
		// override
		// 重载，加入对 model 和 template 的处理
		parseElement: function(){
			this._initModel();
			
			Balloon.superclass.parseElement.call(this);
		},
		
		/**
		 * 构建model
		 *
		 * @method _initModel
		 * @private
		 */
		_initModel: function(){
			var model = {
					complex: false
				},
				hasCloseX = this.get('hasCloseX'),
				hasTitle = this.get('title') != '';
			
			if(hasCloseX || hasTitle){
				model.complex = true;
				model.hasCloseX = hasCloseX;
			}
			
			// 设置model
			this.set('model', model);
		},
		
		// override此方法，保证能在可视区域内显示
		show: function() {
			// 每次show前先还原最原始指定的方向
			//this.set(ARROW_POSITION, this._originArrowPosition);
			
			Balloon.superclass.show.call(this);
			
			// 根据当前的位置来调整方向
			this._makesureInViewport();
			
			return this;
		},
		
		// 保证在可视区域内
		_makesureInViewport: function(){
			if (this.get(IN_VIEWPORT)){
				var arrowPosition = this._originArrowPosition,//this.get(ARROW_POSITION),
					$window = $(window),
					scrollTop = $window.scrollTop(),
					scrollLeft = $window.scrollLeft(),
					element = this.element,
					distance = this.get('distance'),
					triggerOffset = $(this.activeTrigger).offset(),
					offset = element.offset();
				
				// tip在参照物的下方
				if(arrowPosition.indexOf('t') > -1){
					// 下过头
					//if(offset.top + element.outerHeight() > scrollTop + $window.outerHeight()){
					if(triggerOffset.top > scrollTop + $window.outerHeight() - (element.outerHeight() + distance)){
						arrowPosition = arrowPosition.replace('t', 'B');
					}
				}
				// tip在参照物的上方
				/*if(arrowPosition.indexOf('b') > -1){
					// 上过头
					if(offset.top < scrollTop){
						arrowPosition = arrowPosition.replace('b', 'T');
					}
				}*/
				// tip在参照物的右方
				if(arrowPosition.indexOf('l') > -1){
					// 右过头
					//if(offset.left + element.outerWidth() > scrollLeft + $window.outerWidth()){
					if(triggerOffset.left > scrollLeft + $window.outerWidth() - (element.outerWidth() + distance)){
						arrowPosition = arrowPosition.replace('l', 'R');
					}
				}
				// tip在参照物的左方
				/*if(arrowPosition.indexOf('r') > -1){
					// 左过头
					if(offset.left < scrollLeft){
						arrowPosition = arrowPosition.replace('r', 'L');
					}
				}*/
				
				// 其他情况就原始的
				/*else {
					arrowPosition = this._originArrowPosition;
				}*/
				
				// 设置新方向
				this.set(ARROW_POSITION, arrowPosition.toLowerCase());
			}
		},
		
		// override
		/*destroy: function(){
			this.hide();
			Balloon.superclass.destroy.call(this);
		},*/
		
		// 设置 align 参数
		_setAlign: function() {
			var alignObject,
				arrowPosition,
				offset = this.get(OFFSET),
				needSet = false;
			
			// 基础版本
			alignObject = this._setAlignBase();
			
			// 对齐的参照物
			/*if(alignElement[0]){
				// 设置activeTrigger是为了popup的show方法中的定位问题
				this.activeTrigger = alignObject.baseElement = alignElement;
				needSet = true;
			}*/
			
			// 边对齐情况特殊处理
			if(this.get(ALIGN_TYPE) == 'line'){
				arrowPosition = this.get(ARROW_POSITION);
				
				// 做调整到达边对齐的效果
				switch(arrowPosition.charAt(1)){
					case 'l':
						alignObject.baseXY[0] = 0;
						alignObject.selfXY[0] = 0;
						break;
					case 'r':
						alignObject.baseXY[0] = '100%';
						alignObject.selfXY[0] = '100%';
						break;
					case 't':
						alignObject.baseXY[1] = 0;
						alignObject.selfXY[1] = 0;
						break;
					case 'b':
						alignObject.baseXY[1] = '100%';
						alignObject.selfXY[1] = '100%';
						break;
					default:
						break;
				}
			}
			
			// 尽量不要使用的人肉微调定位
			var offLeft = -offset[0];
			var offTop = -offset[1];
			if(offLeft != 0){
				alignObject.selfXY[0] += ((offLeft > 0 ? '+' : '') + String(offLeft));
			}
			if(offTop != 0){
				alignObject.selfXY[1] += ((offTop > 0 ? '+' : '') + String(offTop));
			}
			
			// 设置
			this.set('align', alignObject);
		},
		
		// 基础算法，移植自 arale/tip 组件
		_setAlignBase: function() {
			var alignObject = {},//{ baseElement: this.get('trigger')[0] },
				arrowShift = this.get('arrowShift'),
				distance = this.get('distance'),
				pointPos = '50%',//this.get('pointPos'),
				direction = this.get('direction');
			
			if (arrowShift < 0) {
				arrowShift = '100%' + arrowShift;
			}
			
			if (direction === 'up') {
				alignObject.baseXY = [pointPos, 0];
				alignObject.selfXY = [arrowShift, '100%+' + distance];
			}
			else if (direction === 'down') {
				alignObject.baseXY = [pointPos, '100%+' + distance];
				alignObject.selfXY = [arrowShift, 0];
			}
			else if (direction === 'left') {
				alignObject.baseXY = [0, pointPos];
				alignObject.selfXY = ['100%+' + distance, arrowShift];
			}
			else if (direction === 'right') {
				alignObject.baseXY = ['100%+' + distance, pointPos];
				alignObject.selfXY = [0, arrowShift];
			}
			
			//this.set('align', alignObject);
			return alignObject;
		},
		
		// 方向改变时对应的UI操作
		_onRenderArrowPosition: function(val, preVal){
			var direction,
				arrowShift;
			
			// 根据箭头位置决定方向
			switch(val.charAt(0)){
				case 'l':
					direction = 'right';
					break;
				case 'r':
					direction = 'left';
					break;
				case 't':
					direction = 'down';
					break;
				case 'b':
					direction = 'up';
					break;
				default:
					break;
			}
			
			// 有些位置需要反向
			if(val == 'tr' || val == 'rb' || val == 'br' || val == 'lb'){
				arrowShift = -defaultArrowShift;
			} else {
				arrowShift = defaultArrowShift;
			}
			
			// 设置方向
			this.set('direction', direction);
			this.set('arrowShift', arrowShift);
			this._setAlign();
			
			// class的设置
			this.element.removeClass(classPrefix + preVal).addClass(classPrefix + val);
		},
		
		// 用于 set 属性后的界面更新
		
		_onRenderContent: function(val) {
			var ctn = this.$('[data-role="content"]');
			if (typeof val !== 'string') {
				val = val.call(this);
			}
			if(ctn){
				ctn.html(val);
			}
		},
		
		_onRenderTitle: function(val) {
			var ctn = this.$('[data-role="title"]');
			if (typeof val !== 'string') {
				val = val.call(this);
			}
			if(ctn){
				ctn.html(val);
			}
		}
	});
	
	module.exports = Balloon;

});

/* DUMMY2 */