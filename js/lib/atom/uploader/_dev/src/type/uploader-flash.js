/**
 * 用Flash的方式异步上传
 */
 
define(function(require, exports, module) {
		var $ = require('$');
    var UploaderBase = require('./uploader-base.js');    
    var swfUploader = require('../swfuploader/swfuploader.js');
    var deconcept = require('../swfuploader/deconcept.js');
    
    var UploaderBaseEvents = UploaderBase.availEvents;
    var EVENTS = {
    			'ready': UploaderBaseEvents.ready,
    			
    			//事件参数， ev.type, ev.fileList{Object};
    			// fileList:{ file0:{ cDate: '', id:'', mDate:'', name:'', size:0 }, file0:{ cDate: '', id:'', mDate:'', name:'', size:'' } }
          'fileSelect': UploaderBaseEvents.fileSelect,
          
          'start': UploaderBaseEvents.start,
          'progress': UploaderBaseEvents.progress,
          'complete': UploaderBaseEvents.complete,
          'completeAll': UploaderBaseEvents.completeAll,
          'error': UploaderBaseEvents.error,
          'cancel': UploaderBaseEvents.cancel
          
          //支持图片压缩时触发的事件
          //'compressProgress': UploaderBaseEvents.compressProgress,
          //'compressCompleteValidate': UploaderBaseEvents.compressCompleteValidate,
          //'compressFail': UploaderBaseEvents.compressFail
    		};

    var FlashUploader = UploaderBase.extend({

        attrs: {
        		//可选文件过滤, extensions:可选文件类型，如*.jpg;*.gif;*.png, description: 选项描述
        		//fileFilters: [{ extensions: '*.jpg;*.gif;*.png', description: 'pic' }],
        		
        		//文件多选 		
        		multiple: true,
        		
        		//是否允许压缩
        		allowCompress: false,
        		compressWidth: 0,
        		compressHeight: 0,
        		quality: 80,
        		
            fileUploadLimit: 0,
            fileQueueLimit: 0,
            debug: false
        },
         
        initialize: function(config) {
            this._uploader = null;
            this._uploadingCount = 0;
            FlashUploader.superclass.initialize.call(this, config);
        },
        Statics: {
            //是否支持Flash上传
            isSupport: function() {
            	//flash play 版本大于或等于10
            	return deconcept.SWFObjectUtil.getPlayerVersion().major >= 10;
            },

            getType: function() {
            	return UploaderBase.UPLOADER_TYPE_FLASH;
        		}
        },

        render: function(){
      	  var that = this;
          var buttonMask = that._renderButtonMask();

          swfUploader.SWFURL = that.get('swfURL') + '?__updateTime=' + uuid();
          that._uploader = new swfUploader( buttonMask, null );

          this._bindEvents();
          $.each( EVENTS, function( eventName, val ){
			    	that._uploader.on( eventName, function(){
			    		var args = Array.prototype.slice.call(arguments);
			    		args = [val].concat(args);
			    		
			    		that.trigger.apply(that, args);
			    	});
			    });
			    
					/*
          $.each( EVENTS, function( eventName, val ){
          	if( eventName == EVENTS.fileSelect ){
          		that.uploader.on( eventName, function( ev ){
          			$.each(ev.fileList, function( fileId, val ){
					    		that.trigger(EVENTS.fileSelect, { file: val, type: EVENTS.fileSelect } );
          			});
				    	});
          	} else {
				    	that.uploader.on( eventName, function(){
				    		var args = Array.prototype.slice.call(arguments);
				    		args = [val].concat(args);
				    		that.trigger.apply(that, args);
				    	});
				    }
			    });
			    */

        },
        
        _bindEvents: function(){
        	this._uploader.on(EVENTS.ready, this._onSWFReady, this);

					//ev.fileList
        	this._uploader.on( EVENTS.fileSelect, function( ev ){
        		for( var fileId in ev.fileList ){
        			this.setUploadingCount( this._uploadingCount + 1 );
        		}
        	}, this);

        	this._uploader.on( EVENTS.complete, function( ev ){
        		this.removeFile( ev.id );
        	}, this);

        },

        _onSWFReady: function(){
        	//this._uploader.setAllowCompress(true);
        	//this._uploader.setAllowLogging(true);
        	this._uploader.setAllowMultipleFiles( this.get('multiple') );
        	if( this.get('fileFilters') ){
        		this._uploader.setFileFilters( this.get('fileFilters') );
        	}
        },
        
        upload: function( fileID, uploadScriptPath, method, vars, fieldName ){
        	this._uploader.upload( fileID, uploadScriptPath, method, vars, fieldName );
        },
        
        uploadAll: function(uploadScriptPath, method, vars, fieldName){
					this._uploader.uploadAll(uploadScriptPath, method, vars, fieldName);
				},

        removeFile: function (fileID){
					this._uploader.removeFile(fileID);
					this.setUploadingCount( this._uploadingCount-1 );
				},
        
        cancel: function(fileId) {
            this._uploader.cancel(fileId);
        },

        clearFileList: function(){
        	this._uploader.clearFileList();
        	this.setUploadingCount( 0 );
        },
        
        setUploadingCount: function( val ){
        	var that = this,
        			prevVal = this._uploadingCount;

        	this._uploadingCount = val;
        	if (this._uploadingCount <= 0) {
      			this._uploadingCount = 0;

      			if( prevVal > 0 ){
      				//防目外部事件侦听时completeAll优于complete执行
	      			setTimeout( function(){
	      				that.trigger( EVENTS.completeAll );
	      			}, 15);
	      		}
        	}
        },
        
        destroy: function() {
            this._uploader.destroy();
            this._removeButtonMask();
            FlashUploader.superclass.destroy.call(this);
        }
    });

    var uuid = (function(prefix){
      var n = 0;
      return function(){
        n++;
        return (prefix || '') + ( new Date().getTime() ) + '_'+ n;
      };
    })();

    module.exports = FlashUploader;

});

/* DUMMY2 */