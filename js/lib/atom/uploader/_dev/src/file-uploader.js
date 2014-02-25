// #require "i18n/en-us.js"
// #require "i18n/zh-cn.js"
// #require "i18n/zh-tw.js"
// #require "i18n/es-es.js"

/**
 * Alibaba 异步上传 单文件解决方案.
 * @author peng.hep, xiaoxin.zhangxx
 */
define(function(require, exports, module) {
    var $ = require('$'),
    
        // 依赖异步上传核心组件
		    Uploader = require('./uploader'),
		    ProgressBar = require('progressbar'),
		    Widget = require('widget'),
		    Templatable = require('templatable'),
		    
		    i18nStr = './i18n/{locale}',
		    i18n = require(i18nStr) || require('./i18n/en-us'),
    
    		TEMPLATE_ELEMENT = require('./file-uploader.tpl'),
    		TEMPLATE_FILE_ITEM = require('./file-uploader-file-item.tpl'),
    		ROLES = {
    			fileList: '[data-role="uploader-list"]',
    			fileItem: '[data-role="uploader-item"]',
    			progressbar: '[data-role="progressbar"]',
    			buttonCancel: '[data-role="uploader-cancel"]',
    			buttonRemove: '[data-role="uploader-remove"]',
    			
    			errorMsg: '[data-role="uploader-error-msg"]'
    		};

    var FileUploader = Widget.extend({
    		Implements: [Templatable],
    		
	    	attrs: {
	    		i18n: i18n,
	    		
	    		model: {},

	    		fileList: [],
	    	
	    		inputElement: '',

	    		template: TEMPLATE_ELEMENT,
	    		templateItem: TEMPLATE_FILE_ITEM
	    		
        },
        
        initialize: function(config) {
          this._uploader = new Uploader(config);
        	
        	//上传文件列表
        	this._uploadFileList = new FileList();
        	this._hasProgressbar = (this._uploader.getType().toLowerCase() !== 'iframe' );

          FileUploader.superclass.initialize.call(this, config);
          this._fileValidator = new FileValidator( this.get('validatorConfig') || [] );
        },
        
        render: function(){
        	this._listElement = this.$( ROLES.fileList );
        	this._inputElement = $( this.get('inputElement') );
        	this._errorList = new ErrorList( { element: this.$( ROLES.errorMsg ) } );
        	
        	this._bindUI();
        	this._uploader.render();
	       	FileUploader.superclass.render.call(this);
	       	
	       	this._RenderFileList();
	       	this._syncUIFileList();
	       	
	        return this;
        },
        
        addFile: function( fileList ){
        	var arr = fileList || [];
        	
        	if(!$.isArray(arr) ){
        		arr= [arr];
        	}
        	
        	this._RenderFileList( arr );
        	this._syncUIFileList();
        },
        
        //初始化文件列表, 临时处理，跟老文件数据对接
        //数据格式[{"error":false,"fileDestOrder":1,"fileFlag":"no","fileId":0,"fileName":"Chrysanthemum.jpg","fileSavePath":"/request/20/00/60/00/200060005/1352083940428_hz-rfqmyalibaba-web1_28319.jpg","fileSize":0,"fileSrcOrder":1,"fileURL":"/request/20/00/60/00/200060005/1352083940428_hz-rfqmyalibaba-web1_28319.jpg","imgURL":""}] 
        _RenderFileList: function( fileList ){
        	var fileList = fileList || this.get('fileList');
        	
        	for( var i = 0, ln = fileList.length; i < ln; i++){
        		this._RenderFile( fileList[i] );
        	}
        },
        
        _RenderFile: function( fileData ){
        	var model = {
	      				fileId: '',
	      				fileName: fileData.fileName
	      			};

	      	model = $.extend(model, this.get('i18n') );
	        var itemHtml = this.compile( this.get('templateItem'), model );
	        var fileItem = $( itemHtml );
	        
	        fileItem.find( ROLES.progressbar ).remove();
	        fileItem.find( ROLES.buttonCancel ).remove();
	        
	        fileItem.data('fileData', fileData);
          this._listElement.append( fileItem );
        },
        
        _bindUI: function(){
      		this.delegateEvents('click [data-role="uploader-remove"]', this.remove);
          this.delegateEvents('click [data-role="uploader-cancel"]', this.cancel);

          this._uploader.on('ready', function(args) {
              this.trigger('ready', args);
          }, this);
          
          this._uploader.on('progress', this._onProgress, this);

          this._uploader.on('complete', this._onComplete, this);
          this._uploader.on('completeAll', this._onCompleteAll, this);
          this._uploader.on('error', this._onError, this);

          this._uploader.on('fileSelect',this._onFileSelect, this);
        },
        
        getType: function(){
        	return this._uploader.getType().toLowerCase();
        },
        
        //ev.fileList
        _onFileSelect: function( ev ){
        	var that = this,
        			fileList = this._uploadFileList.add( ev.fileList ),
        			selectedFileCount = 0,
        			isFileNumError = false,
        			fileHtml,
        			fileElement,
        			fileTotal,
        			model;

        	this._errorList.clearError();
        	$.each(fileList, function( id, file ){
        		selectedFileCount++;
        	});

        	fileTotal = this._getItems().length + selectedFileCount;
        	$.each(fileList, function( id, file ){
        		var result = that._addUploadFile( $.extend({}, file, { fileTotal:fileTotal } ) );
        		if( result.error && result.error === 'fileNum'){
        			//文件总数超出限制，则直接退出
        			isFileNumError = true;
        			return false;
        		}
        	});

        	if( isFileNumError ){
        		for( var fileId in fileList ){
        			if (fileList.hasOwnProperty(fileId)) {
	        			this._removeUploadFile( fileId );
	        		}
        		}
        		return false;
        	}

          this.trigger('fileSelect', ev);
        },
        
        _addUploadFile: function( file ){
					var model = {
								fileId: file.id,
								fileName: file.name,
								hasProgressbar: this._hasProgressbar
							},
							
							fileData = {
			        	fileName: file.name,
			        	fileSize: file.size,
			        	fileTotal: file.fileTotal
			        },
			        result = this._fileValidator.execute( fileData ),
			        fileElement,
			        fileHtml,	        			        
			        postParams;

	        if( result.error ){
	        	this._removeUploadFile( file.id );
	        	this._errorList.addError( result.message );
	        	return result;
	        }

	        model = $.extend(model, this.get('i18n') );
      		fileHtml = this.compile( this.get('templateItem'), model );
      		fileElement = $( fileHtml );
          this._listElement.append( fileElement );
          
          if( this._hasProgressbar ){
	          var progressBarElement = fileElement.find(ROLES.progressbar);
	          var t = new ProgressBar({
	              element: progressBarElement,
	              needLabel: false,
	              value: 0,
                  width: ''
	          }).render();
	          progressBarElement.data('progressbar', t);
	        }

          fileElement.find(ROLES.buttonCancel).show();
          fileElement.find(ROLES.buttonRemove).hide();

          fileElement.data('fileData', {fileName: file.name, fileSize: file.size});

          postParams = $.extend({ name: this._getPostFileName(file.name) }, this.get('postParams') );
          this._uploader.upload( file.id, this.get('uploadURL'), 'POST', postParams, 'file' );

          return result;
        },
        
        _getPostFileName:(function(){
        	var count = 0; 
        	return function( fileName ){
        		count++;
        		return new Date().getTime() + '_' + count + fileName.substr(fileName.lastIndexOf('.'));
        	};
        })(),

        _removeUploadFile: function( fileId ){
        	this._uploader.removeFile( fileId );
        	this._uploadFileList.remove( fileId );
        },

    		_onProgress: function( ev ){
    			var bytesLoaded = ev.bytesLoaded;
					var bytesTotal = ev.bytesTotal;
					var presontage = bytesLoaded / bytesTotal * 100;
					
					if( this._hasProgressbar ){
						var progressBarWidget = this._getProgressbarWidget( ev.id );
						if (progressBarWidget) {
						    if (isNaN(presontage) && progressBarWidget.get('value') !== 100) {
						        // iFrame上传没有进度条
						        progressBarWidget.set('value', 100);
						    } else {
						        progressBarWidget.set('value', presontage);
						    }
						}
					}
					
					this.trigger('progress', ev);
    		},
        
        _onComplete: function( ev ){
        	var serverData = new ServerDataReader( ev.data );
        	var fileData = {};

        	var item = this._getItem( ev.id );
          var progressBarWidget;
          var progressBarElement = this._getProgressbar( ev.id, item );
          
          if( this._hasProgressbar ){
          	progressBarWidget = this._getProgressbarWidget(ev.id, item);
          }
          
          // 服务器返回详见 http://b2b-doc.alibaba-inc.com/pages/viewpage.action?pageId=75799212
          if ( serverData.isSuccess() ) {
          	fileData = serverData.getData();
          	fileData.fileName = fileData.fileName || item.data('fileData').fileName || '';
            item.data('fileData', fileData );

            this._getButtonCancel(ev.id, item).hide();
            this._getButtonRemove(ev.id, item).show();

            if( progressBarWidget ){
            	progressBarWidget.destroy();
            } else {
            	progressBarElement.remove();
            }
          } else {
          	fileData = serverData.getData();
          	fileData.fileName = fileData.fileName || item.data('fileData').fileName || '';
            item.data('fileData', fileData );
            
          	if( progressBarWidget ){
            	progressBarWidget.destroy();
            } else {
            	progressBarElement.remove();
            }
          	item.remove();

          	this._errorList.addError( serverData.getErrorMsg(), fileData);
          }
          this.trigger('complete', ev);
    		},

    		_onCompleteAll: function( ev ){
    			this._uploadFileList.clear();
    			this._clearUploadStatus();
    			this._syncUIFileList();
                this.trigger('completeAll');
    		},
    		
    		_onError: function( ev ){
    			var fileId = ev.id;
    			var item = this._getItem( fileId );
    			if( item.length ){
	    			var progressbarWidget;
	    			if( this._hasProgressbar ) {
	    				progressbarWidget = this._getProgressbarWidget( fileId, item);
	    				if( progressbarWidget ){ progressbarWidget.destroy(); }
	    			}
	    			this._errorList.addError( this.get('i18n').uploaderError, item.data('fileData'));
	    			item.remove();
	    		}
	    		
	    		if( this._uploadFileList.hasFile( fileId ) ){
	    			this._removeUploadFile( fileId );
	    		}
	    		
    			this.trigger('error', ev);
    		},
    		
        _getItems: function(){
        	return this.$(ROLES.fileItem);
        },

        _getItem: function( fileId ){
        	return this.$('[data-item-file-id="' + fileId + '"]');
        },
        
        _getProgressbarWidget: function( fileId, parentElement ){
        	var progressElement = this._getProgressbar( fileId, parentElement);
        	return progressElement.data('progressbar');
        },
        
        _getRole: function( roleName, fileId, parentElement ){
        	parentElement = parentElement || this.element;
        	return parentElement.find('[data-'+ roleName + '-file-id="' + fileId + '"]');
        },
        
        _getProgressbar: function( fileId, parentElement ){
        	return this._getRole('progressbar', fileId, parentElement);
        },
        
        _getButtonCancel: function( fileId, parentElement ){
        	return this._getRole('button-cancel', fileId, parentElement);
        },
        
        _getButtonRemove: function( fileId, parentElement ){
        	return this._getRole('button-remove', fileId, parentElement);
        },
        
        //清除上传文件的状态属性
        _clearUploadStatus: function(){
        	var items = this._getItems();

        	items.each(function( i, itemEl ){
        		var item = $(itemEl);
        		item.attr('data-item-file-id', '');

        		item.find( ROLES.progressbar ).attr('data-progressbar-file-id', '');
        		item.find( ROLES.buttonCancel ).attr('data-button-cancel-file-id', '');
        		item.find( ROLES.buttonRemove ).attr('data-button-remove-file-id', '');
        	});
        },

        cancel: function(ev) {
					ev = ev.originalEvent;
					var target = ev.srcElement ? ev.srcElement : ev.target;
					target = $(target);
					
					var item = target.closest(ROLES.fileItem);
					this._cancel( item );
        },
        
        _cancel: function(fileItem){
        	var fileId = fileItem.attr('data-item-file-id');
					var progressbar;

          this._uploader.cancel( fileId );
          this._removeUploadFile( fileId );
          
					if( this._hasProgress ){
						progressbar = this._getProgressbarWidget( fileId, fileItem );
						if( progressbar ){ progressbar.destroy(); }
					}
          fileItem.remove();

          this.trigger('cancel', {fileId: fileId });
        },
        
        _cancelAll: function(){
        	var that = this;
        	var items  = that._getItems();

        	items.each(function(i, itemEl){
        		var fileItem = $(itemEl);
        		if( fileItem.attr('data-item-file-id') ){
        			that._cancel( fileItem );
        		}
        	});
        },

        remove: function(ev) {
	        var target = ev.srcElement ? ev.srcElement : ev.target;
	        target = $(target);

	        target.closest(ROLES.fileItem).remove();
	        this._syncUIFileList();
	        this.trigger('remove');
        },
        
        removeAll: function(){
        	this._cancelAll();
        	
        	this._getItems().remove();
	        this._syncUIFileList();
	        
	        this._errorList.clearError();
	        
	        this.trigger('remove');
        },
        
        _syncUIFileList: function(){
        	var fileList  = this._getFileListData(),
        			returnStrArr = [];
        	
        	for(var i = 0, ln = fileList.length; i < ln; i++ ){
        		returnStrArr.push( this._fileDataToString(fileList[i], i ) );
        	}
        	
        	this._inputElement.val( returnStrArr.join('\r\n') );
        },
        
        _fileDataToString: function( fileData, index ){
        	var returnStrArr = [],
        			file = $.extend( {
					        			fileHeight: 0,
					        			fileWidth: 0,
				
					        			//数据补全,以下字段为兼容老的异步上传接口，待删除
					        			isError: false,
					        			fileId:0,
					        			fileSrcOrder: index,
					        			fileDestOrder: index,
					        			fileFlag: 'add'
					        		}, fileData),

	        		fields = [	'fileId',
	        							'fileSavePath', 
	        							'fileURL', 
	        							'fileName', 
	        							'fileSize', 
	        							'isError', 
	        							'fileSrcOrder', 
	        							'fileDestOrder', 
	        							'fileFlag'];

        	for( var i in fields ){
        		if (fields.hasOwnProperty(i)) {
	        		returnStrArr.push( fields[i] + ':' + file[ fields[i] ] );
	        	}
        	}

          return returnStrArr.join('|');
        },
        
        _getFileListData: function(){
        	var arrData = [];
        	var items = this._getItems();
        	items.each(function(i, itemEl){
        		arrData.push( $(itemEl).data('fileData') );
        	});
        	return arrData;
        },

         destroy: function() {
          this._uploader.destroy();
          FileUploader.superclass.destroy.call(this);
        }
    });
    
    var ErrorList = function( config ){
    	this.initialize( config );
    };

    ErrorList.prototype = {
    	_errorList: [],

    	initialize: function( config ){
    		this.element = $(config.element);
    	},
    	
    	addError: function( msg, data ){
    		this._errorList.push( this.parseMsg(msg, data ) );
    		this.show();
    	},

    	clearError: function(){
    		this._errorList = [];
    		this.element.empty();
    		this.hide();
    	},

    	hide: function(){
    		this.element.hide();
    	},

    	show: function(){
    		var errorList = this._errorList;
    		this.element.html( this._errorList.join('<br />') );
    		this.element.show();
    	},
    	
    	parseMsg: function( msg, data ){
    		return stringComplie(msg, data );
    	}
    };
    
    var ServerDataReader = function( data ){
    	this.data =  $.parseJSON( data );
    	this.data.code = parseInt(this.data.code, 10);
    };
    
    ServerDataReader.prototype = {
    	_errorMsgMap: {
    		0: '',
    		1: i18n.serverErrorCode1,
    		2: i18n.serverErrorCode2,
    		3: i18n.serverErrorCode3,
    		4: i18n.serverErrorCode4
    	},
    	
    	isSuccess: function(){
	      return this.data.code === 0;
    	},
    	
    	//临时处理，做数据接口对接，为兼容老数据
    	getData: function(){
    		if( !this.isSuccess() ){ return {}; }
    		
    		var file = this.data;
    		var retData = {
	        fileSavePath: file.fs_url,
	        fileURL: file.url,
	        fileName: file.name,
	        fileSize: file.size,
	        fileHeight: file.height,
	        fileWidth: file.width,
	        hash: file.hash
    		};
    		return retData;
    	},
    	
    	getErrorMsg: function(){
    		return this._errorMsgMap[ this.data.code ] || '';
    	}
    };
    
    var FileList = function(){
    	this.initialize();
    };
    
    FileList.prototype = {
    	_fileList: null,
    	
    	initialize: function(){
    		this._fileList = {};
    	},
    	
    	//返回本次添加成功的文件列表
    	add: function( fileId, fileData ){
    		var argsln = arguments.length;
    		var ret = {};
    		
    		if( argsln == 1 ){
    			var fileList = fileId;
    			for(var k in fileList){
    				if (fileList.hasOwnProperty(k)) {
	    				if( !this._fileList[k] ){ 
	    					ret[k] = fileList[k];
	    				}
	    				this._add( k, fileList[k] );
	    			}
    			}
    		} else if( argsln == 2){
    			if( !this._fileList[fileId] ){ 
    				ret[fileId] = fileData;
    			}
    			this._add( fileId, fileData );
    		}
    		return ret;
    	},
    	
    	_add: function( fileId, fileData ){
    		this._fileList[fileId] = fileData;
    	},

        hasFile: function( fileId ){
           return !!this._fileList[fileId];
        },
    	
    	remove: function( fileId ){
    		if( this._fileList[fileId] ){
    			delete this._fileList[fileId];
    		}
    	},
    	
    	clear: function(){
    		this._fileList = {};
    	}
    	
    };
    
    
    var FileValidator = function( config ){
    	this.initialize( config );
    };
    
    FileValidator.prototype = {
    	_validateConfig: null,

    	initialize: function( config ){
    		this._validateConfig = config || [];
    	},
    	
    	execute: function( file, params ){
    		var that = this;
    		var validate = this._validateConfig;
    		var result = { message: '', error: '', file: '' };

    		params = params || {};
    		$.each(validate, function( i, ruleConfig ){
    			var ruleName = ruleConfig.ruleName;
    			var params  =  $.extend( {} , params, ruleConfig.params || {} );

    			if( validatorRules[ ruleName ] ){
	  			 	if( !validatorRules[ ruleName ].call( that, file, params ) ){
	  			 		result.message = stringComplie( ruleConfig.message, $.extend( {}, params, file ) );
	  			 		
	  			 		result.error = ruleName;
	  			 		result.file = file;
	  			 		return false;
	  				}
    			} else {
    				//TODO
    			}
    		});
    		
    		return result;
    	}	
    	
    };
    
    FileValidator.addRule =  function( ruleName, fn ){
    	validatorRules[ ruleName ] = fn;
    };
    
    var validatorRules = {
  		// maxUpload: 最多允许上传的文件数

  		//最多允许存在的文件数量
  		'fileNum': function( file, params ){
  			return file.fileTotal <= params.max;
  		},

  		//文件大小限制
			'fileSize': function( file, params ){
				return file.fileSize <= params.max;
			},
			
			// allowTypes: 允许的文件类型  
			'allowTypes': function( file, params ){
				var name = file.fileName;
				var ext=name.substring(name.lastIndexOf('.')+1, name.length);
				var exts = params.fileTypes.split(';');
				
				ext=ext.toLowerCase();
				
				if(ext.indexOf('?')>0){
					ext=ext.substring(0,ext.indexOf('?'));
			  }

		   for(var i =0, ln = exts.length; i<ln; i++){
		   	if(exts[i].toLowerCase() == ext){ return true; }
		   }

		   return false;
			}
  	};
  	
  	function stringComplie( str, o ){
  		var i, j, k, key, v, meta, token, 
            SPACE=' ', LBRACE='{{', RBRACE='}}';

       if( !o || $.isEmptyObject(o) ){ return str; }
       
        for (;;) {
            i = str.lastIndexOf(LBRACE);
            if (i < 0) {
               break;
            }
            j = str.indexOf(RBRACE, i);
            if (i + 2 >= j) {
               break;
            }

            token = str.substring(i + 2, j);
            key = token;
            meta = null;
            k = key.indexOf(SPACE);
            if (k > -1) {
                meta = key.substring(k + 1);
                key = key.substring(0, k);
            }

            v = o[key] || '';

            str = str.substring(0, i) + v + str.substring(j + 2);
        }
       
        return str;
  	}

    module.exports = FileUploader;
});

/* DUMMY2 */