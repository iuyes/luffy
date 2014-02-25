define(function(require, exports, module) {

  var $ = require('$');
  var Widget = require('widget');
  var Templatable = require('templatable');

  var Repeatable = Widget.extend({
    Implements: [Templatable],
    attrs: {
    	
    	events:{
    		'click [data-role="repeatable-remove"]':'_onClickRemove'
    	},
    	
    	//列元素选择符
    	itemSelector: '[data-role="repeatable-item"]'

      //cloneTemplate
      //min
      //max      
      //data:[]
    },

    setup: function () {
    	var ln = this.$( this.get('itemSelector') ).length;
      this._parseCloneTemplate();

      this.set('length', ln );
      this._initData();
    },
    
    clone: function (model) {
      var tmodel;

      if ( this.get('max') && this.get('length') >= this.get('max') ) {
        return;
      }

      var element = this.element;
      var cloneNode;

      tmodel = $.extend(model || {}, {_count: this.get('length')+1});
      cloneNode = $(this.compile(this._cloneTemplate, tmodel));
			
			//如果有元素选择符，则插入到最后一个元素的后面，否则直接添加到element里

			var items = this.$( this.get('itemSelector') );
			if(items.length){
				items.last().after( cloneNode );
			}else{
				element.prepend( cloneNode );
			}
      
      this.set('length', this.get('length')+1 );
      
      this.trigger('clone', this.get('length'), cloneNode, tmodel);
    },
    
    _onClickRemove: function( e ){
    	e.preventDefault();
    	this.removeItemByChild( e.target );
    },

    remove: function( itemNode ){
    	if ( this.get('min') && this.get('length') <= this.get('min') ) {
        return;
      }

			itemNode = $(itemNode);
			if( itemNode.length ){
				this.trigger('beforeRemove', itemNode);

	    	itemNode.remove();
	    	this.set('length', this.get('length')-1 );

	    	this.trigger('afterRemove', itemNode);
	    }
    },

    removeItemByChild: function( childNode ){
    	var item = $(childNode).closest( this.get('itemSelector') );
      this.remove( item );
    },
    
    _initData: function(){
    	var data = this.get('data');
    	if( data && data.length > 0){
	    	for(var i = 0, ln = data.length; i < ln; i++){
	    		this.clone(data[i]);
	    	}
    	}
    },
    
    _parseCloneTemplate: function () {
      var cloneTemplate = this.get('cloneTemplate'),
      		tmp;

      if ($.type(cloneTemplate) == 'object') {
        tmp = $(cloneTemplate).clone();
        tmp = $('[id]', tmp).andSelf().removeAttr('id');
    		cloneTemplate = $('<div></div>').append( tmp ).html();
      }

      this._cloneTemplate = cloneTemplate;
    }
  });

  module.exports = Repeatable;
});
