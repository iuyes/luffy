/**
 * 用iFrame的方式上传,通过提交表单到隐藏的iframe的方式来实现.
 * 用iframe上传的方式监测不了文件类型,提供不了文件上传的进度,也取消不了正在上传的文件
 */
 
define(function(require, exports, module) {
    var Uploader = require('./uploader-base.js');
    var $ = require('$');

    var IframeUploader = Uploader.extend({
    	  attrs: {
    	  	//上传超时时间设为3分钟
    	  	uploadOverTime: 1000 * 60 * 3,
    	  	
    	  	fileUploadLimit: 0
        },
        
        events: {

        },
        
        initialize: function(config) {
            this.cache = {
                hiddenForm: null,
                availFileCount:0,
                isReady: false
            };
            this._fileId = -1;
            this._idFileMap = {};
            IframeUploader.superclass.initialize.call(this, config);
        },

        'Statics': {
            //所有浏览器均支持iFrame上传
            isSupport: function() {
              return true;
            },
            getType: function(){
            	return Uploader.UPLOADER_TYPE_IFRAME;
            }
        },

        render: function() {
        		var that = this,
        				buttonMask = this._renderButtonMask();
        		
            this.cache.buttonMask = buttonMask;
            
	          buttonMask.change( function( ev ){
	          	var target = $( ev.target );
	          	if( target.attr('data-rote') == 'uploader-iframe-input' ){

	          		that._queueElement.append( target );
	          		that._onFileSelect({ 
	          			target: ev.target,
	          			id: target.attr('id').replace('_input-uploader-file-', '')
	          		});
	          		that._renderInputFile();
	          	}
	          });
	          
	          this._renderInputFile();
	         
	          this._queueElement = $('<div style="display:none;"></div>');
	          buttonMask.parent().append( this._queueElement );

            IframeUploader.superclass.render.call(this);
            if(!this.cache.isReady) {
                this.trigger(Uploader.availEvents.ready);
                this.cache.isReady = true;
            }
            return this;
        },
                
        _renderInputFile: function(){
        	var inputFileButton;
        	
        	this._fileId++;
        	inputFileButton = $('<input type="file" id="_input-uploader-file-' + this._fileId + '"  data-rote="uploader-iframe-input" autocomplete="off" name="file" />');
        	this.cache.buttonMask.append( inputFileButton );
        	
        	inputFileButton.attr('hidefocus', true).css({
        		opacity: 0,
            outline: 0,
            position:'absolute',
          	left: '-1800px',
          	top: '-20px',
            cursor: 'pointer',
        		fontSize: '150px'
        	});
        },
        
        remove: function() {
            this.cache.availFileCount--;
        },
        getUploadedCount: function() {
            var availFileCount = this.cache.availFileCount;
            return availFileCount;
        },
        addExistFile: function(){
            this.cache.availFileCount++;
            this._fileId++;
        },
         
        _onFileSelect: function( ev ){
        	var that = this,
        			fileId = ev.id,
           		cache = that.cache,
          		fileList = {},
          		target = ev.target,
          		fileName = $(target).val();

          // 保证各个浏览器操作系统取到的名字都是一致.
          if($.browser.msie || $.browser.webkit) {
          	var tempFileArr = fileName.split('\\');
          	fileName = tempFileArr[tempFileArr.length - 1];
          }
          var fileObj = {
              name: fileName,
              id: fileId,
              size: -1
          };

          fileList[ fileId ] = fileObj;

          this._idFileMap[ fileId ] = fileObj;
          cache.availFileCount++;

          that.trigger(Uploader.availEvents.fileSelect, {
          	'fileList': fileList,
          	'type': Uploader.availEvents.fileSelect
          });
          
        },
        
        _getInputFile: function( fileId ){
        	return $('#_input-uploader-file-'+fileId);
        },
        
        upload: function( fileId, uploadURL, method, vars ){

        	var that = this,
        			cache = this.cache,        			
        			postParams = vars || {},
        			fileObj = this._idFileMap[fileId] || {},
        			inputFile = this._getInputFile( fileId ),
        			isFormComplete = false,
        			helper;

        	if( !inputFile.length ){ return ; }

        	method = method || 'POST';
        	
          that.trigger(Uploader.availEvents.start, {
            'id': fileId,
            'file': fileObj,
            'type': Uploader.availEvents.start
          });

          var hiddenForm = $('<form id="upload-hidden-form-'+ fileId +'" method="'+ method +'" enctype="multipart/form-data" style="display:none;"></form>');
          hiddenForm.attr('action', uploadURL);
          
          var tIiframe = $('<iframe style="display:none;' + ' border: 0; width: 0; height: 0; border:0" id="upload-hidden-iframe-' + fileId + '" name="upload-hidden-iframe-' + fileId + '"></iframe>');

          hiddenForm.append(tIiframe);
          hiddenForm.attr('target', 'upload-hidden-iframe-' + fileId);

          $('body').append(hiddenForm);
          for(var i in postParams ) {
          	var tInput = $('<input type="hidden" name="'+ i + '" value="'+ postParams[i] +'" />');
            hiddenForm.append(tInput);
          }
          hiddenForm.append(inputFile);
          hiddenForm.submit();

          that.trigger(Uploader.availEvents.progress, {
            file: fileObj,
            type: Uploader.availEvents.progress,
            bytesLoaded: 0,
            bytesTotal: 100
          });

          hiddenForm.find('iframe').bind('load', function(ev) {
          		if( isFormComplete ){ return ; }
          		if( helper ){	clearTimeout(helper); }

          		var serverMsg = $.trim( $(this.contentWindow.document.body).text() || '');

              if( that._isUploadComplete( serverMsg ) ){
	              that.trigger(Uploader.availEvents.complete, {
	                  'file': fileObj,
	                  'id': fileId,
	                  'type': Uploader.availEvents.complete,
	                  'data': serverMsg
	              });
	            } else {
	            	that.trigger(Uploader.availEvents.error, {
	                  'file': fileObj,
	                  'id': fileId,
	                  'status': 1,
	                  'type': Uploader.availEvents.error
	              });
	            }
	            hiddenFormDestroy();
	            isFormComplete = true;
          });

          helper = setTimeout( function(){
          	if( isFormComplete ){ return ; }
          	
          	isFormComplete = true;
          	that.trigger(Uploader.availEvents.error, {
	                  'file': fileObj,
	                  'id': fileId,
	                  
	                  //上传超时
	                  'status': 2,
	                  'type': Uploader.availEvents.error
	          });

          	hiddenFormDestroy();
          }, this.get('uploadOverTime') );
          
          function hiddenFormDestroy(){
          	hiddenForm.find('iframe').off('load');
	          hiddenForm.remove();
	
	          if( that._idFileMap[fileId] ) {
	        		delete that._idFileMap[fileId];
	        	}
	
	        	if( $.isEmptyObject( that._idFileMap ) ){
	            that.trigger(Uploader.availEvents.completeAll);
	          }
          }

        },
        
        cancel: function( fileId ){
        	var submitForm = $( '#upload-hidden-form-' + fileId),
        			inputFile  = this._getInputFile(fileId);

        	if( submitForm.length ){
        		if( inputFile.length ){
        			this._queueElement.append( inputFile );
        		}
        		
        		submitForm.find('iframe').off('load');
            submitForm.remove();
            
            this.trigger(Uploader.availEvents.cancel, { 
            	'id': fileId, 
            	'type': Uploader.availEvents.cancel,
            	'file': this._idFileMap[fileId] || {}
           	});
        	}
        },
        
        removeFile: function (fileId){
        	var inputFile = this._getInputFile(fileId);
        	inputFile.remove();
        	
        	if( this._idFileMap[fileId] ) {
        		delete this._idFileMap[fileId];
        	}
        	if( $.isEmptyObject( this._idFileMap ) ){
        		this.trigger(Uploader.availEvents.completeAll);
        	}
				},
        
        //根据内容判断上传是否成功, 通过简单的判断信息是否是json格式来确定是否上传完成
        _isUploadComplete: function( serverMsg ){
        	return serverMsg.length > 0 && serverMsg[0] == '{' && serverMsg[serverMsg.length -1] == '}';
        },

        destroy: function(){
        	this.cache.buttonMask.off('change');
        	this.cache.buttonMask.remove();
        	IframeUploader.superclass.destroy.call(this);
        }
    });

    module.exports = IframeUploader;
});
/* DUMMY2 */