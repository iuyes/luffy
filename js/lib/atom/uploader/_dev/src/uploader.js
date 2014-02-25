/**
 * 异步上传核心
 */
 
define(function(require, exports, module) {
    var Base = require('base');
    
    var UploaderBaseModule = require('./type/uploader-base.js');
    var HTML5UploaderModule = require('./type/uploader-html5.js');
    var FlashUploaderModule = require('./type/uploader-flash.js');
    var IframeUploaderModule = require('./type/uploader-iframe.js');

    //this.uploader = null;

    var Uploader = Base.extend({

        attrs: {
            // 用户配置的上传的优先级
            runtimes: 'html5,flash,iframe',
            multiple: true
        },

         // 当前采用什么方式上传
    		_type: '',

        initialize: function(config) {
            Uploader.superclass.initialize.call(this, config);
            this.config = config;
            this._initUploader();
        },
        
        _initUploader: function() {
            var that = this;
            var uploaderClass = that._getUploaderClass();

            that.uploader = new uploaderClass(that.config);
            this._type = uploaderClass.getType();
                       
            for(var key in UploaderBaseModule.availEvents) {
            	if (UploaderBaseModule.availEvents.hasOwnProperty(key)) {
	                (function(eventName) {
	                    that.uploader.on(eventName, function(args) {
	                        that.trigger(eventName, args);
	                    });
	                })(UploaderBaseModule.availEvents[key]);
	            }
            }
            
        },

				_getUploaderClass: function(){
        	var typeArr = this.get('runtimes').split(',');
        	var i, len, j, l, type;
        	var uploaderClasses = [HTML5UploaderModule, FlashUploaderModule, IframeUploaderModule ];

          for(i = 0, len = typeArr.length; i < len; i++) {
              type = typeArr[i].toUpperCase();
              for(j = 0, l = uploaderClasses.length; j < l; j++){
              	if( type === uploaderClasses[j].getType() && uploaderClasses[j].isSupport() ){
              		return uploaderClasses[j];
              	}
              }
          }
          
          return null;
        },
        
        render: function() {
          this.uploader.render();
          return this;
        },
        
        getType: function() {
        	return this._type;
        },
        
        cancel: function(fileId) {
          this.uploader.cancel(fileId);
        },

        cancelAll: function() {
          this.uploader.cancelAll();
        },
        
        upload: function( fileID, uploadScriptPath, method, vars, fieldName ){
        	this.uploader.upload( fileID, uploadScriptPath, method, vars, fieldName );
        },
        
        uploadAll: function(uploadScriptPath, method, vars, fieldName){
					this.uploader.uploadAll(uploadScriptPath, method, vars, fieldName);
				},
        
        removeFile: function (fileID){
					this.uploader.removeFile(fileID);
				},

        clearFileList: function(){
        	this.uploader.clearFileList();
        },

        destroy: function() {
	        this.uploader.destroy();
	        Uploader.superclass.destroy.call(this);
        }
        
    });

    module.exports = Uploader;
});
/* DUMMY2 */