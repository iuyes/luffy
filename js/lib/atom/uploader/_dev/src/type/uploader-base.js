/**
 * 上传组件的基类
 */
 define(function(require, exports, module) {
    var Widget = require('widget'),
      	$ 		= require('$');

    var Uploader = Widget.extend({
        events: {},

        attrs: {
        	//是否允许多选
        	multiple: true,
        	uploadButton: '',

        	//文件选择后是否立即上传
        	autoUpload: true
        },

        initialize: function(config) {
        	Uploader.superclass.initialize.call(this, config);
        },
        
        //生成透明用遮罩层盖住假的button
        _renderButtonMask: function(){
        	var mask = $('<div></div>');
        	var uploadButton = $( this.get('uploadButton') );
        	
        	uploadButton.wrap('<span class="ui-uploader-file-button-wrap"></span>');

        	mask.css({
                width: parseInt(uploadButton.outerWidth(true), 10) + 'px',
                height: parseInt(uploadButton.outerHeight(true), 10) + 3 + 'px',
                position: 'absolute',
                top: uploadButton.position().top,
                left: uploadButton.position().left,
                overflow: 'hidden',
                opacity: 0,
                cursor: 'default'
          });

          uploadButton.parent().append(mask).css({
                zoom:1
          });
          
          this._buttonMask = mask;
          
          return mask;          
        },
        
        _removeButtonMask: function(){
        	if(this._buttonMask){
        		this._buttonMask.remove();
        		this._buttonMask = null;
        	}
        },
        
        upload: function( fileID, uploadScriptPath, method, vars, fieldName ){
        },
        
        clearFileList: function(){
        },
        
        cancel: function( fileId ) {
        },
        
        cancelAll: function() {
        },

        uploadAll: function(uploadScriptPath, method, vars, fieldName)
				{
				},
        
        removeFile: function (fileID){
				},
        
        Statics: {
            // 静态常量,用于标识上传方式.
            UPLOADER_TYPE_HTML5: 'HTML5',
            UPLOADER_TYPE_FLASH: 'FLASH',
            UPLOADER_TYPE_IFRAME: 'IFRAME',

            // 当前浏览器是否支持此上传方式
            isSupport: function() {
                return false;
            },

            /**
		         * 抽象方法
		         */
		        getType: function() {
		        	return 'base';
		        },

            // 上传组件支持触发的自定义事件.继承的子类需要根据自己的时机触发相应的事件,便于UI层进行相应的处理.
            availEvents: {
                'ready': 'ready',
                'fileSelect': 'fileSelect',
                'start': 'start',
                'progress': 'progress',
                'complete': 'complete',
                'completeAll': 'completeAll',
                'error': 'error',
                'cancel': 'cancel',
                
                //TODO
                'cancelAll': 'cancelAll',
                
                //支持文件拖拽上传时触发的事件
                'dragEnter': 'dragEnter',
                'dragLeave': 'dragLeave',
                'dragOver': 'dragOver',
                'fileDrop': 'fileDrop',
                
                //支持图片压缩时触发的事件
                'compressProgress': 'compressProgress',
                'compressCompleteValidate': 'compressCompleteValidate',
                'compressFail': 'compressFail'
            }
        }
    });

    module.exports = Uploader;
});

/* DUMMY2 */