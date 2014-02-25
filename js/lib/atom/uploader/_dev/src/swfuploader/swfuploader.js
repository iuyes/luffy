/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.6.0
*/
 
define(function(require, exports, module) {
	
	var $ = require('$'),
			base = require('base'),
			deconcept = require('./deconcept');
	
	var FlashAdapter;
	
	window.__swfUploader__FlashAdapter = FlashAdapter = base.extend({

		/**
		 * The URL of the SWF file.
		 * @property _swfURL
		 * @type String
		 * @private
		 */
		_swfURL: null,
	
		/**
		 * The ID of the containing DIV.
		 * @property _containerElement
		 * @type selector || jqueryObject
		 * @private
		 */
		_containerElement: null,
	
		/**
		 * A reference to the embedded SWF file.
		 * @property _swf
		 * @private
		 */
		_swf: null,
	
		/**
		 * The id of this instance.
		 * @property _id
		 * @type String
		 * @private
		 */
		_id: null,
	
		/**
		 * Indicates whether the SWF has been initialized and is ready
		 * to communicate with JavaScript
		 * @property _initialized
		 * @type Boolean
		 * @private
		 */
		_initialized: false,
		
		attrs:{
			altText: {
				getter: function() {
					return this._swf.getAltText();
				},
				setter: function(val) {
					return this._swf.setAltText(val);
				}
			},
			
			swfURL: {
				value: '',
				readOnly: true
			}
		},
		
		initialize: function(swfURL, containerElement, attributes, buttonSkin) {
			if( this._initialized ){ return ; }
			
			// set up the initial events and attributes stuff
			this._queue = this._queue || [];
			this._events = this._events || {};
			this._configs = this._configs || {};
			
			attributes = attributes || {};
			
			//the Flash Player external interface code from Adobe doesn't play nicely
			//with the default value, yui-gen, in IE
			this._id = attributes.id = attributes.id || generateId();
			attributes.version = attributes.version || "10.0.0";
			attributes.backgroundColor = attributes.backgroundColor || "#ffffff";
			
			attributes.swfURL = swfURL;


			this._swfURL = swfURL;
			this._containerElement = $(containerElement);
			
			//embed the SWF file in the page
			this._embedSWF(this._swfURL, this._containerElement, attributes.id, attributes.version,
				attributes.backgroundColor, attributes.expressInstall, attributes.wmode, buttonSkin);

			this.initAttrs( attributes );
			
			/**
			 * Fires when the SWF is initialized and communication is possible.
			 * @event contentReady
			 */
			//Fix for iframe cross-domain issue with FF2x 
			try
			{
				this.trigger("contentReady");
			}
			catch(e){}
		},
	
		/**
		 * Public accessor to the unique name of the FlashAdapter instance.
		 *
		 * @method toString
		 * @return {String} Unique name of the FlashAdapter instance.
		 */
		toString: function()
		{
			return "FlashAdapter " + this._id;
		},
	
		/**
		 * Nulls out the entire FlashAdapter instance and related objects and removes attached
		 * event listeners and clears out DOM elements inside the container. After calling
		 * this method, the instance reference should be expliclitly nulled by implementer,
		 * as in myChart = null. Use with caution!
		 *
		 * @method destroy
		 */
		destroy: function()
		{
			//kill the Flash Player instance
			if(this._swf)
			{
				var container = this._containerElement[0];
				container.removeChild(this._swf);
			}
			
			var instanceName = this._id;
			
			//null out properties
			for(var prop in this)
			{
				if( this.hasOwnProperty(this, prop) )
				{
					this[prop] = null;
				}
			}
			
			FlashAdapter.superclass.destroy.call(this);
		},
	
		/**
		 * Embeds the SWF in the page and associates it with this instance.
		 *
		 * @method _embedSWF
		 * @private
		 */
		_embedSWF: function(swfURL, containerElement, swfID, version, backgroundColor, expressInstall, wmode, buttonSkin)
		{
			//standard SWFObject embed
			var swfObj = new deconcept.SWFObject(swfURL, swfID, "100%", "100%", version, backgroundColor);
	
			if(expressInstall)
			{
				swfObj.useExpressInstall(expressInstall);
			}
	
			//make sure we can communicate with ExternalInterface
			swfObj.addParam("allowScriptAccess", "always");
			
			if(wmode)
			{
				swfObj.addParam("wmode", wmode);
			}
			
			swfObj.addParam("menu", "false");
			
			//again, a useful ExternalInterface trick
			swfObj.addVariable("allowedDomain", document.location.hostname);
	
			//tell the SWF which HTML element it is in
			swfObj.addVariable("elementID", swfID);
	
			// set the name of the function to call when the swf has an event
			swfObj.addVariable("eventHandler", "__swfUploader__FlashAdapter.eventHandler");
			if (buttonSkin) {
			swfObj.addVariable("buttonSkin", buttonSkin);
			}
			var container = containerElement[0];
			var result = swfObj.write(container);
			if(result)
			{
				this._swf = $('#'+swfID)[0];
				//if successful, let's add an owner property to the SWF reference
				//this will allow the event handler to communicate with a YAHOO.widget.FlashAdapter
				this._swf.owner = this;
			}
			else
			{
				//YAHOO.log("Unable to load SWF " + swfURL);
			}
		},
	
		/**
		 * Handles or re-dispatches events received from the SWF.
		 *
		 * @method _eventHandler
		 * @private
		 */
		_eventHandler: function(event)
		{
			var type = event.type;
			switch(type)
			{
				case "swfReady":
	   				this._loadHandler();
					return;
				case "log":
					//YAHOO.log(event.message, event.category, this.toString());
					return;
			}
			//be sure to return after your case or the event will automatically fire!
			this.trigger(type, event);
		},
	
		/**
		 * Called when the SWF has been initialized.
		 *
		 * @method _loadHandler
		 * @private
		 */
		_loadHandler: function()
		{
			//TODO
			//this.setAttributes(this._attributes, true);

			this._initialized = true;
			this.trigger("contentReady");
		}
		
	});


	/**
	 * Receives event messages from SWF and passes them to the correct instance
	 * of FlashAdapter.
	 *
	 * @method YAHOO.widget.FlashAdapter.eventHandler
	 * @static
	 * @private
	 */
	FlashAdapter.eventHandler = function(elementID, event)
	{
		var loadedSWF = $('#' + elementID)[0];

		if(!loadedSWF.owner)
		{
			//fix for ie: if owner doesn't exist yet, try again in a moment
			setTimeout(function() { FlashAdapter.eventHandler( elementID, event ); }, 0);
		}
		else
		{
			loadedSWF.owner._eventHandler(event);
		}
	};

	FlashAdapter.eventHandler.log = function( msg ){
		//console.log(msg);
	};
	
	
	/**
	 * The number of proxy functions that have been created.
	 * @static
	 * @private
	 */
	FlashAdapter.proxyFunctionCount = 0;
	
	/**
	 * Creates a globally accessible function that wraps a function reference.
	 * Returns the proxy function's name as a string for use by the SWF through
	 * ExternalInterface.
	 *
	 * @method YAHOO.widget.FlashAdapter.createProxyFunction
	 * @static
	 * @private
	 */
	FlashAdapter.createProxyFunction = function(func)
	{
		var index = __swfUploader__FlashAdapter.proxyFunctionCount;
		__swfUploader__FlashAdapter["proxyFunction" + index] = function()
		{
			return func.apply(null, arguments);
		};
		
		__swfUploader__FlashAdapter.proxyFunctionCount++;
		return "__swfUploader__FlashAdapter.proxyFunction" + index.toString();
	};
	
	/**
	 * Removes a function created with createProxyFunction()
	 * 
	 * @method YAHOO.widget.FlashAdapter.removeProxyFunction
	 * @static
	 * @private
	 */
	FlashAdapter.removeProxyFunction = function(funcName)
	{
		var index = -1;
		
		//quick error check
		if(!funcName || (index = funcName.indexOf("__swfUploader__FlashAdapter.proxyFunction") )< 0)
		{
			return;
		}

		funcName = funcName.substr( '__swfUploader__FlashAdapter.'.length );
		__swfUploader__FlashAdapter[funcName] = null;
	};
	

	/**
	 * The YUI Uploader Control
	 * @module uploader
	 * @description <p>YUI Uploader provides file upload functionality that goes beyond the basic browser-based methods. 
	 * Specifically, the YUI Uploader allows for:
	 * <ol>
	 * <li> Multiple file selection in a single "Open File" dialog.</li>
	 * <li> File extension filters to facilitate the user's selection.</li>
	 * <li> Progress tracking for file uploads.</li>
	 * <li> A range of file metadata: filename, size, date created, date modified, and author.</li>
	 * <li> A set of events dispatched on various aspects of the file upload process: file selection, upload progress, upload completion, etc.</li>
	 * <li> Inclusion of additional data in the file upload POST request.</li>
	 * <li> Faster file upload on broadband connections due to the modified SEND buffer size.</li>
	 * <li> Same-page server response upon completion of the file upload.</li>
	 * </ol>
	 * </p>
	 * @title Uploader
	 * @namespace YAHOO.widget
	 * @requires yahoo, dom, element, event
	 */
	/**
	 * Uploader class for the YUI Uploader component.
	 *
	 * @namespace YAHOO.widget
	 * @class Uploader
	 * @uses YAHOO.widget.FlashAdapter
	 * @constructor
	 * @param containerElement {HTMLElement} Container element for the Flash Player instance.
	 * @param buttonSkin {String} [optional]. If defined, the uploader is 
	 * rendered as a button. This parameter must provide the URL of a button
	 * skin sprite image. Acceptable types are: jpg, gif, png and swf. The 
	 * sprite is divided evenly into four sections along its height (e.g., if
	 * the sprite is 200 px tall, it's divided into four sections 50px each).
	 * Each section is used as a skin for a specific state of the button: top
	 * section is "up", second section is "over", third section is "down", and
	 * fourth section is "disabled". 
	 * If the parameter is not supplied, the uploader is rendered transparent,
	 * and it's the developer's responsibility to create a visible UI below it.
	  */
	var Uploader = FlashAdapter.extend({
		
		initialize: function( containerElement, buttonSkin ){
			var newWMode = "window";
	
			if (!(buttonSkin)) {
				newWMode = "transparent";
			}
			
			Uploader.superclass.initialize.call(this, Uploader.SWFURL, containerElement, {wmode:newWMode}, buttonSkin);

			this._initEvents();
		
		},
		
		//YUI 支持的事件
		_initEvents: function(){
			var that = this;
			
			//对外保持一致的事件接口, key为yui uploader 提供的事件支持， value为uploader 对外提供的对应的事件名
			var eventsMap =  {
          contentReady: 'ready',
          uploadStart: 'start',
          uploadProgress: 'progress',
					uploadCompleteData: 'complete',
					completeAll: 'completeAll',
					uploadError: 'error',
					uploadCancel: 'cancel'
	    };
	    
	    $.each( eventsMap, function( eventName, val ){
	    	that.on( eventName, function(){
	    		var args = Array.prototype.slice.call(arguments);
	    		args = [val].concat(args);
	    		that.trigger.apply(that, args);
	    	});
	    });

	    
	    //以下注释的代码为yui uploader swf 所支持的事件

			//压缩后上传
				/**
			 * Fires when an compress complete validate.
			 *
			 * @event compressCompleteValidate
			 * @param event.type {String} The event type
			 * @param event.fileData {Object} 文件数据含文件大小及名字.
			 * @param event.fileId {String} 文件号.
			 */	
			
			//压缩过程 
			//compressProgress: 'compressProgress',
			
			/**
				*当对要压缩的文件进行校验时触发
				*@event compressCompleteValidate
			*/
			
			//压缩失败时触发的事件
			/**
			 * Fires when an compress error occurs.
			 *
			 * @event compressError
			 * @param event.type {String} The event type
			 * @param event.id {String} The id of the file that was being uploaded when the error has occurred.
			 * @param event.status {String} The status message associated with the error.
			 */	
			
			
			/**
			 * Fires when the uploader is clicked.
			 *
			 * @event click
			 * @param event.type {String} The event type
			 */
			
			/**
			 * Fires when the user has finished selecting files in the "Open File" dialog.
			 *
			 * @event fileSelect
			 * @param event.type {String} The event type
			 * @param event.fileList {Array} An array of objects with file information
			 * @param event.fileList[].size {Number} File size in bytes for a specific file in fileList
			 * @param event.fileList[].cDate {Date} Creation date for a specific file in fileList
			 * @param event.fileList[].mDate {Date} Modification date for a specific file in fileList
			 * @param event.fileList[].name {String} File name for a specific file in fileList
			 * @param event.fileList[].id {String} Unique file id of a specific file in fileList
			 */
		
			/**
			 * Fires when an load of a specific file has started.
			 *
			 * @event loadStart
			 * @param event.type {String} The event type
			 * @param event.id {String} The id of the file that's started to upload
			 */
		
			/**
			 * Fires when new information about the upload progress for a specific file is available.
			 *
			 * @event uploadProgress
			 * @param event.type {String} The event type
			 * @param event.id {String} The id of the file with which the upload progress data is associated
			 * @param bytesLoaded {Number} The number of bytes of the file uploaded so far
			 * @param bytesTotal {Number} The total size of the file
			 */
			
			/**
			 * Fires when an upload of a specific file has started.
			 *
			 * @event uploadStart
			 * @param event.type {String} The event type
			 * @param event.id {String} The id of the file that's started to upload
			 */
			
			/**
			 * Fires when an upload validate of a specific file has started.
			 *
			 * @event uploadValidate
			 * @param event.type {String} The event type
			 * @param event.id {String} The id of the file that's started to upload
			 */
			
			
				/**
			 * Fires when new information about the upload progress for a specific file is available.
			 *
			 * @event uploadProgress
			 * @param event.type {String} The event type
			 * @param event.id {String} The id of the file with which the upload progress data is associated
			 * @param bytesLoaded {Number} The number of bytes of the file uploaded so far
			 * @param bytesTotal {Number} The total size of the file
			 */
	
			/**
			 * Fires when an upload for a specific file is cancelled.
			 *
			 * @event uploadCancel
			 * @param event.type {String} The event type
			 * @param event.id {String} The id of the file with which the upload has been cancelled.
			 */	
		
			/**
			 * Fires when an upload for a specific file is complete.
			 *
			 * @event uploadComplete
			 * @param event.type {String} The event type
			 * @param event.id {String} The id of the file for which the upload has been completed.
			 */	
		
			/**
			 * Fires when the server sends data in response to a completed upload.
			 *
			 * @event uploadCompleteData
			 * @param event.type {String} The event type
			 * @param event.id {String} The id of the file for which the upload has been completed.
			 * @param event.data {String} The raw data returned by the server in response to the upload.
			 */	
			
			/**
			 * Fires when an upload error occurs.
			 *
			 * @event uploadError
			 * @param event.type {String} The event type
			 * @param event.id {String} The id of the file that was being uploaded when the error has occurred.
			 * @param event.status {String} The status message associated with the error.
			 */	
		
		},
		
		/**
		 * Starts the upload of the file specified by fileID to the location specified by uploadScriptPath.
		 *
		 * @param fileID {String} The id of the file to start uploading.
		 * @param uploadScriptPath {String} The URL of the upload location.
		 * @param method {String} Either "GET" or "POST", specifying how the variables accompanying the file upload POST request should be submitted. "GET" by default.
		 * @param vars {Object} The object containing variables to be sent in the same request as the file upload.
		 * @param fieldName {String} The name of the variable in the POST request containing the file data. "Filedata" by default.
		 * @param headers {Object} An object containing variables that should be set as headers in the POST request. The following header names
		 * cannot be used: 
		 * <code>
		 * Accept-Charset, Accept-Encoding, Accept-Ranges, Age, Allow, Allowed, Authorization, Charge-To, Connect, Connection, 
		 * Content-Length, Content-Location, Content-Range, Cookie, Date, Delete, ETag, Expect, Get, Head, Host, Keep-Alive, 
		 * Last-Modified, Location, Max-Forwards, Options, Post, Proxy-Authenticate, Proxy-Authorization, Proxy-Connection, 
		 * Public, Put, Range, Referer, Request-Range, Retry-After, Server, TE, Trace, Trailer, Transfer-Encoding, Upgrade, 
		 * URI, User-Agent, Vary, Via, Warning, WWW-Authenticate, x-flash-version.
		 * </code> 
		 */
		upload: function(fileID, uploadScriptPath, method, vars, fieldName)
		{
			this._swf.upload(fileID, uploadScriptPath, method, vars, fieldName);
		},
		
		/**
		 * Starts uploading all files in the queue. If this function is called, the upload queue is automatically managed.
		 *
		 * @param uploadScriptPath {String} The URL of the upload location.
		 * @param method {String} Either "GET" or "POST", specifying how the variables accompanying the file upload POST request should be submitted. "GET" by default.
		 * @param vars {Object} The object containing variables to be sent in the same request as the file upload.
		 * @param fieldName {String} The name of the variable in the POST request containing the file data. "Filedata" by default.
		 * @param headers {Object} An object containing variables that should be set as headers in the POST request. The following header names
		 * cannot be used: 
		 * <code>
		 * Accept-Charset, Accept-Encoding, Accept-Ranges, Age, Allow, Allowed, Authorization, Charge-To, Connect, Connection, 
		 * Content-Length, Content-Location, Content-Range, Cookie, Date, Delete, ETag, Expect, Get, Head, Host, Keep-Alive, 
		 * Last-Modified, Location, Max-Forwards, Options, Post, Proxy-Authenticate, Proxy-Authorization, Proxy-Connection, 
		 * Public, Put, Range, Referer, Request-Range, Retry-After, Server, TE, Trace, Trailer, Transfer-Encoding, Upgrade, 
		 * URI, User-Agent, Vary, Via, Warning, WWW-Authenticate, x-flash-version.
		 * </code> 
		 */
		uploadAll: function(uploadScriptPath, method, vars, fieldName)
		{
			this._swf.uploadAll(uploadScriptPath, method, vars, fieldName);
		},
	
		/**
		 * Cancels the upload of a specified file. If no file id is specified, all ongoing uploads are cancelled.
		 *
		 * @param fileID {String} The ID of the file whose upload should be cancelled.
		 */
		cancel: function(fileID)
		{
			this._swf.cancel(fileID);
		},
	
		/**
		 * Clears the list of files queued for upload.
		 *
		 */
		clearFileList: function()
		{
			this._swf.clearFileList();
		},
		
		/**
		 * Removes the specified file from the upload queue. 
		 *
		 * @param fileID {String} The id of the file to remove from the upload queue. 
		 */
		removeFile: function (fileID) 
		{
			this._swf.removeFile(fileID);
		},
	
		/**
		 * Turns the logging functionality on.
		 * Uses Flash internal trace logging, as well as YUI Logger, if available.
		 *
		 * @param allowLogging {Boolean} If true, logs are output; otherwise, no logs are produced.
		 */
	  setAllowLogging: function (allowLogging)
	  {
	  	this._swf.setAllowLogging(allowLogging);
	  },
		
		/**
		 * Sets the number of simultaneous uploads when using uploadAll()
		 * The minimum value is 1, and maximum value is 5. The default value is 2.
		 *
		 * @param simUploadLimit {int} Number of simultaneous uploads, between 1 and 5.
		 */
	  setSimUploadLimit : function (simUploadLimit)
	  {
	     this._swf.setSimUploadLimit(simUploadLimit);
	  },
		
		/**
		 * Sets the flag allowing users to select multiple files for the upload.
		 *
		 * @param allowMultipleFiles {Boolean} If true, multiple files can be selected. False by default.
		 */     
	  setAllowMultipleFiles : function (allowMultipleFiles) 
	  {
	     this._swf.setAllowMultipleFiles(allowMultipleFiles);
	  },
	
		/**
		 * Sets the file filters for the "Browse" dialog.
		 *
		 *  @param newFilterArray An array of sets of key-value pairs of the form
		 *  {extensions: extensionString, description: descriptionString, [optional]macType: macTypeString}
		 *  The extensions string is a semicolon-delimited list of elements of the form "*.xxx", 
		 *  e.g. "*.jpg;*.gif;*.png". 
		 */       
    setFileFilters : function (fileFilters) 
    {
       this._swf.setFileFilters(fileFilters);
    },
    setTimerOut : function (time)
    {
       this._swf.setTimerOut(time);
    },
    
    setCompressCompleteSize : function (compressMinSize)
    {
       this._swf.setCompressCompleteSize(compressMinSize);
    },
    
    setRiseCount : function (count)
    {
       this._swf.setRiseCount(count);
    },

		// setAllowCompress(allowCompress:Boolean) 设置是否允许压缩
    setAllowCompress : function (allowCompress) 
    {
       this._swf.setAllowCompress(allowCompress);
    },

    // setCompressSize(compressWidth:int,compressHeight:int) 设置压缩高宽
    setCompressSize : function (compressWidth,compressHeight) 
    {
       this._swf.setCompressSize(compressWidth,compressHeight);
    },

   	// setQuality(quality:int) 设置压缩高宽
    setQuality : function (quality) 
    {    	
       this._swf.setQuality(quality);
    },
    
    // setOverTime(overTime:boolean) 设置是否超时
    setOverTime : function (overTime) 
    {    	
       this._swf.setOverTime(overTime);
    },
    
    // uploadFile(fileId :String) 参数文件号 压缩后上传
    uploadFile : function (fileId) 
    {    	
       this._swf.uploadFile(fileId);
    },
	
		/**
		 * Enables the mouse events on the Uploader.
		 * If the uploader is being rendered as a button,
		 * then the button's skin is set to "up"
		 * (first section of the button skin sprite).
		 *
		 */
		enable : function ()
		{
			this._swf.enable();
		},
	
		/**
		 * Disables the mouse events on the Uploader.
		 * If the uploader is being rendered as a button,
		 * then the button's skin is set to "disabled"
		 * (fourth section of the button skin sprite).
		 *
		 */
		disable : function () 
		{
			this._swf.disable();
		}
		
	});

	var generateId = (function(){
		var n = 0;
		return function(){
			n++;
			return '__swfuploader__id' + ( new Date().getTime() ) + '__'+n;
		};
	})();

	module.exports = Uploader;

});
/* DUMMY2 */