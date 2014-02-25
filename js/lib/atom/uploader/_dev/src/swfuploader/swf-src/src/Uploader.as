package

{

	import com.yahoo.yui.YUIAdapter;
	
	import flash.display.Loader;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.DataEvent;
	import flash.events.Event;
	import flash.events.FocusEvent;
	import flash.events.HTTPStatusEvent;
	import flash.events.IOErrorEvent;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.events.ProgressEvent;
	import flash.events.SecurityErrorEvent;
	import flash.external.ExternalInterface;
	import flash.utils.*;
	import flash.net.*;
	import flash.ui.Keyboard;
	import flash.utils.Dictionary; 	

	
	import flash.system.Capabilities;
	import flash.system.Security;
	import flash.system.SecurityDomain;
	import flash.system.System;
	
	import flash.utils.ByteArray;

	//增加 UploadPostHelper	作用 request 数据转换
	import com.ali.UploadPostHelper;
	//增加 压缩类
	import com.ali.BitmapMinify;	
	
	[SWF(backgroundColor=0xffffff)]

	/**
	 * The base Uploader class for YUI's Flash-based file uploader.
	 * 
	 * @author Allen Rabinovich
	 */

	public class Uploader extends YUIAdapter {

	//--------------------------------------
	//  Constructor
	//--------------------------------------	

		public function Uploader()
		{
			super();

		}


	    //--------------------------------------------------------------------------
	    //
	    //  Variables
	    //
	    //--------------------------------------------------------------------------

		private var allowMultiple:Boolean = false;
		private var allowLog:Boolean = false;
		private var filterArray:Array;

		private var fileDataList:Object;
		private var fileRefList:Object;
		private var fileIDList:Dictionary;
		private var fileIDCounter:Number;
		private var filesToUpload:Array;
		
		//全局存储request对象 用于外部参数传入获取对应requestURL对象
		private var gRequestList:Object;

		private var singleFile:FileReference;
		private var multipleFiles:FileReferenceList;
		
		//是否允许压缩，默认允许
		private var allowCompress:Boolean = true;		
		
		//压缩高宽 默认800 * 800
		private var maxWidth:int = 800;
		private var maxHeight:int = 800;
		
		//记录设置后高度用于初始化循环压缩数据
		private var initWidth:int = 800;
		private var initHeight:int = 800;
		
		//图片质量值
		private var quality:int = 80;
		
		private var initQuality:int = 80;
		
		//超时时间
		private var timeOut:uint = 30000;
		
		//private var isTimeout:Boolean = true;
		private var timeoutId:uint;
		
		//for debug
		private var bmpCompressing:BitmapMinify; 
		
		private var riseCount:int = 20;  
		
		private var compressTimes:int = 0;
		
		private var compressCompleteSize:int = 200 * 1024;

		
		
		
		/**
		 * Determines how many files will be uploaded simultaneously
		 *
		 * @see setSimUploadLimit
		 * @langversion 3.0
		 * @playerversion Flash 9.0.28.0
		 */
		public var simultaneousUploadLimit:Number = 2;
		
		// Track the number of current upload threads
		private var currentUploadThreads:Number = 0;

		// How the uploader is rendered, either "button" or "transparent"
		private var renderType:String;
		
		// The Sprite containing the rendered UI.
		private var buttonSprite:Sprite = new Sprite();
		
		// The skin for the button, if "button" renderType is used.
		private var buttonSkin:Loader = new Loader();
		
		// Height and width for the button
		private var buttonHeight:Number;
		private var buttonWidth:Number;
		
		//--------------------------------------
		//  Public Methods
		//--------------------------------------
		
		/*设置压缩后最小值*/
		public function setCompressCompleteSize(compressMinSize:int):void{
			if(compressMinSize){
				compressCompleteSize = compressMinSize;
			}			
		}
		
		//设置质量递减增量
		public function setRiseCount(count:int):void{
			if(riseCount){
				riseCount = count;
			}
		}
		
		/*设置超时时间*/
		public function setTimerOut(time:uint):void{
			if(time){
				timeOut = time;
			}
		}
		/**
		 * Sets the number of simultaneous file uploads possible.
		 * The maximum is 5. 并发处理数设置
		 * @param numberOfUploads Number of simultaneous uploads, no fewer than 1
		 * and no larger than 5.
		 */
		 public function setSimUploadLimit (simUploadLimit:int) : void {
		 	if (simUploadLimit <= 1) {
		 		this.simultaneousUploadLimit = 1;
		 	}
		 	else if (simUploadLimit >= 5) {
		 		this.simultaneousUploadLimit = 5;
		 	}
		 	else {
		 		this.simultaneousUploadLimit = simUploadLimit;
		 	}
		 }
				
		//是否允许压缩设置
		public function setAllowCompress(allowCompress:Boolean):void{			
			this.allowCompress = allowCompress;			
		}
		
		//设置压缩宽高
		public function setCompressSize(compressWidth:int,compressHeight:int):void{			
			this.maxWidth = compressWidth;
			this.maxHeight = compressHeight;
			//记录设置后的高度
			this.initWidth = compressWidth;
			this.initHeight = compressHeight;
		}
		
		//设置图片质量 1-100 之间的整数值
		public function setQuality(nQuality:int):void{			
			this.quality = ( nQuality > 100 ) ? nQuality : 100;
			this.quality = ( nQuality > 1 ) ? nQuality : 1;			
			this.initQuality = this.quality;
		}

	    /**
	     *  Sets a list of file type filters for the "Open File(s)" dialog.
		 *  
	     *  @param newFilterArray An array of sets of key-value pairs of the form
	     *  {extensions: extensionString, description: descriptionString, macType: macTypeString [optional]}
	     *  The extension string is a semicolon-delimited list of elements of the form "*.xxx", 
	     *  e.g. "*.jpg;*.gif;*.png".
	     */
		 public function setFileFilters(newFilterArray:Array) : void {
		 	filterArray = processFileFilterObjects(newFilterArray);
		 	
		 	if (allowLog) {
		 		var logString:String = "File filters have been set to the following: \n";
		 		for each (var ff:FileFilter in filterArray) {
		 			logString += ff.extension + ": " + ff.description + "\n";
		 		}
		 		logMessage(logString);
		 	}
		 }

	    /**
	     *  Sets a flag allowing logging in Flash trace and Yahoo logger.
		 *  
	     *  @param allowLogging Whether to allow log messages.
	     * 
	     */
		public function setAllowLogging(allowLogging:Boolean) : void {
			this.allowLog = allowLogging;
			logMessage("Logging has been turned " + (allowLog ? "on." : "off."));
		}
		
		/**
	     *  Sets a flag allowing multiple file selection in the "Browse" dialog.
		 *  
	     *  @param allowMultiple Whether to allow multiple file selection.
	     * 
	     */
		public function setAllowMultipleFiles(allowMultipleFiles:Boolean) : void {
			this.allowMultiple = allowMultipleFiles;
			logMessage("Multiple file upload has been turned " + (allowMultiple ? "on." : "off."));		
		}

		
	    /**
	     *  Triggers a prompt for the user to browse their file system to select
		 *  files to be uploaded.
		 *  
	     *  @param allowMultiple Whether to allow the user to select more than
	     *  one file
	     * 
	     *  @param filterArray An array of filter objects, each with <code>
	     *  description</code>, and <code>extensions</code> properties which
		 *  determine which files the user is allowed to select
	     */
		 

			 
			

		private function browse(allowMultiple:Boolean = false, filterArray:Array = null):void {

			if(!allowMultiple) {
				logMessage("Browsing for a single file.")
				singleFile = new FileReference();
				singleFile.addEventListener(Event.SELECT, singleFileSelected);

				if(filterArray) {
					singleFile.browse(filterArray);
				}
				else {
					singleFile.browse();
				}
			}

			else {

				logMessage("Browsing for one or more files.")
				multipleFiles = new FileReferenceList();
				multipleFiles.addEventListener(Event.SELECT, multipleFilesSelected);

				if(filterArray) {
					multipleFiles.browse(filterArray);
				} 

				else {
					multipleFiles.browse();
				}

			}

		}



	    /**
	     *  Removes the file from the set to be uploaded
		 *  
	     *  @param fileID The ID of the file to be removed
	     */

		public function removeFile(fileID:String):Object {

			// TODO: Do we need to remove the item from filesToUpload also?

			delete fileDataList[fileID];
			delete fileRefList[fileID];
			//增加删除gRequestList中的临时数据
			delete gRequestList[fileID];

			return fileDataList;
		}

		public function enable () : void {
			if (renderType == "button") {
				this.addEventListener(MouseEvent.ROLL_OVER, buttonMouseOver);
				this.addEventListener(MouseEvent.ROLL_OUT, buttonMouseOut);
				this.addEventListener(MouseEvent.MOUSE_DOWN, buttonMouseDown);
				this.addEventListener(MouseEvent.MOUSE_UP, buttonMouseUp);
				this.addEventListener(MouseEvent.CLICK, handleMouseClick);
				buttonSkin.y = 0;
			}
			else {
				this.addEventListener(MouseEvent.CLICK, handleMouseClick);
				this.addEventListener(MouseEvent.CLICK, transparentClick);			
				this.addEventListener(MouseEvent.MOUSE_DOWN, transparentDown);
				this.addEventListener(MouseEvent.MOUSE_UP, transparentUp);
				this.addEventListener(MouseEvent.ROLL_OVER, transparentRollOver);
				this.addEventListener(MouseEvent.ROLL_OUT, transparentRollOut);
			}
			
			logMessage("Uploader UI has been enabled.");
		}
		
		public function disable () : void {
			if (renderType == "button") {
				this.removeEventListener(MouseEvent.ROLL_OVER, buttonMouseOver);
				this.removeEventListener(MouseEvent.ROLL_OUT, buttonMouseOut);
				this.removeEventListener(MouseEvent.MOUSE_DOWN, buttonMouseDown);
				this.removeEventListener(MouseEvent.MOUSE_UP, buttonMouseUp);
				this.removeEventListener(MouseEvent.CLICK, handleMouseClick);
				buttonSkin.y = -3*buttonHeight;
			}
			else {
				this.removeEventListener(MouseEvent.CLICK, handleMouseClick);
				this.removeEventListener(MouseEvent.CLICK, transparentClick);
			
				this.removeEventListener(MouseEvent.MOUSE_DOWN, transparentDown);
				this.removeEventListener(MouseEvent.MOUSE_UP, transparentUp);
				this.removeEventListener(MouseEvent.ROLL_OVER, transparentRollOver);
				this.removeEventListener(MouseEvent.ROLL_OUT, transparentRollOut);
			}
			
			logMessage("Uploader UI has been disabled.");
		}

	    /**
	     *  Clears the set of files that had been selected for upload
	     */

		public function clearFileList():Boolean {

			// TODO: Remove event listeners (or weak references?)

			filesToUpload = [];
			fileDataList = new Object();
			fileRefList = new Object();
			fileIDList = new Dictionary();
			gRequestList = new Object();
			fileIDCounter = 0;
			
			logMessage("The file list has been cleared.");
			
			return true;
		}



	    /**
	     *  Uploads a file corresponding to a specified ID to a specified path where a script handles writing to the server.
		 *  
	     *  @param fileID The ID of the file to be uploaded
	     *  @param url The path to the serverside script
	     *  @param method The HTTP submission method. Possible values are "GET" and "POST"
	     *  @param vars An object containing variables to be sent along with the request
	     *  @param fieldName The field name that precedes the file data in the upload POST operation. 
	     *  The uploadDataFieldName value must be non-null and a non-empty String.
	     *  @param headers An object containing variables that should be set as headers in the POST request. The following header names
	     *  cannot be used: 
	     *  <code>
	     *  Accept-Charset, Accept-Encoding, Accept-Ranges, Age, Allow, Allowed, Authorization, Charge-To, Connect, Connection, 
	     *  Content-Length, Content-Location, Content-Range, Cookie, Date, Delete, ETag, Expect, Get, Head, Host, Keep-Alive, 
	     *  Last-Modified, Location, Max-Forwards, Options, Post, Proxy-Authenticate, Proxy-Authorization, Proxy-Connection, 
	     *  Public, Put, Range, Referer, Request-Range, Retry-After, Server, TE, Trace, Trailer, Transfer-Encoding, Upgrade, 
	     *  URI, User-Agent, Vary, Via, Warning, WWW-Authenticate, x-flash-version.
	     *  </code>
	     */
		

		//压缩
		private function compress(fr:FileReference):void{
			//清除之前的延时执行
			if(timeoutId){				
				clearTimeout(timeoutId);
			}
			
			//设置新的延时执行
			timeoutId = setTimeout(onTimeout,timeOut);
			
			//if(bmpCompressing){
					//clearCompress(bmpCompressing);
			//}
			bmpCompressing = new BitmapMinify(quality,timeOut);						
			bmpCompressing.addEventListener( Event.COMPLETE, compressComplete );
			bmpCompressing.addEventListener( "compressFail", compressFail );
			bmpCompressing.addEventListener( "compressTimeOut", compressTimeOut );
			bmpCompressing.addEventListener( "progressing", compressProgress );
			bmpCompressing.minify( fr, maxWidth, maxHeight);
		}
		private function onTimeout():void{
			compressTimeOut(null);
		}
		
		//清理压缩对象
		private function clearCompress(bmpMinfier:BitmapMinify):void{			
			//清理压缩对象，垃圾收集			
			bmpMinfier.removeEventListener( Event.COMPLETE, compressComplete );
			bmpMinfier.removeEventListener( "compressFail", compressFail );
			bmpMinfier.removeEventListener( "progressing", compressProgress );
			bmpMinfier = null;
			System.gc();		
		}
		
		//创建请求
		private function createRequest(fileName:String, byteArray:ByteArray, uploadDataFieldName:String = "Filedata", uploadFilenameFieldName:String = "filename", parameters:Object = null):URLRequest{
			
			var request:URLRequest = gRequest;		
			request.method  = URLRequestMethod.POST;			
			request.data = UploadPostHelper.getPostData(fileName, byteArray, uploadDataFieldName, uploadFilenameFieldName, parameters);
			request.contentType = "multipart/form-data; boundary=" + UploadPostHelper.getBoundary();
			return request;
		
		}
		
		//压缩超时事件
		private function compressTimeOut(event:Event):void{
			
			if (event) {
				logMessage("Compress error for " + fileIDList[gFr] );
				clearCompress( event.target as BitmapMinify );
			}else{
				clearCompress( bmpCompressing as BitmapMinify );
			}
			
			var newEvent:Object = new Object();
			
			newEvent.type = "compressFail";
			newEvent.id = fileIDList[gFr];
			newEvent.fileName = gFr.name;
			newEvent.failType = "timeOut";

			//只要出错择调用外部js处理函数
			super.dispatchEventToJavaScript(newEvent);
		}
		
		//文件类型更新
		private function changeFileTypeToJPG(fileName:String):String{
			var newFileName:String;
			if(fileName.lastIndexOf('.') != -1){
				var results:Array = fileName.split('.'); 
				var typeName:String = results.pop();
				var tmpTypeName:String = typeName.toLocaleLowerCase();
				if(tmpTypeName == 'jpg' || tmpTypeName == 'jpeg'){
					newFileName = fileName;
				}else{
					newFileName = fileName.replace(typeName,'jpg');
				}
			}else{
				newFileName = fileName + '.jpg';
			}
			return newFileName;			
		}
		
		//压缩完成
		private function compressComplete(event:Event):void{
				
			//清理压缩对象
			clearCompress(event.target as BitmapMinify);
			var request:URLRequest = gRequest;
			var newFileName:String = changeFileTypeToJPG(gFr.name);
			request = createRequest(newFileName, event.target.output as ByteArray, gFieldName, "fname", gVars);
			var fileId:String = fileIDList[gFr];			
			gRequestList[fileId] = request;
			
			//构建校验文件对象信息
			var vFr:Object = new Object();
			vFr['name'] = newFileName;
			vFr['size'] = event.target.output.length;
					
			if((vFr['size'] > compressCompleteSize) && quality > 50 && compressTimes < 2){
				
				clearCompress(event.target as BitmapMinify);
				
				if( compressTimes == 0 ){
					maxWidth = 600;
					maxHeight = 600;
				}
				
				if( compressTimes == 1 ){
					quality = 60;
				}
				
				compressTimes++;				
				compress(gFr);
				
			}else{
				
				var newEvent:Object = new Object();
				newEvent.cHeight = bmpCompressing.getCompressHeight();
				newEvent.cWidth = bmpCompressing.getCompressWidth();
				newEvent.fileId = fileId;
				newEvent.fileData = vFr;
				newEvent.fileName = newFileName;
				newEvent.quality = quality;
				//初始化循环压缩数据
				quality = initQuality;
				compressTimes = 0;
				maxWidth = initWidth;
				maxHeight = initHeight;
				
				newEvent.id = fileId;
				newEvent.type = "compressCompleteValidate";
				
				// 校验 compressCompleteValidate会通过js触发uploadFile
				super.dispatchEventToJavaScript(newEvent);
			
			}		
			
		


			
			//校验后上传，此上传放到js流中调用
			//uploadFile(fileId);
		}

		
		//压缩过程 
		private function compressProgress(event:ProgressEvent):void{
			logMessage("Progress for " + fileIDList[gFr] + ": " + event.bytesLoaded.toString() + " / " + event.bytesTotal.toString());
			var newEvent:Object = new Object();
			newEvent.id = fileIDList[gFr];
			newEvent.bytesLoaded = event.bytesLoaded;
			newEvent.bytesTotal = event.bytesTotal;
			newEvent.type = "compressProgress";
			newEvent.fileName = gFr.name;			
			super.dispatchEventToJavaScript(newEvent);
		}
		
		//压缩失败
		private function compressFail( event:Event):void{
			
			if (event) {
				logMessage("Compress error for " + fileIDList[gFr] );
				clearCompress( event.target as BitmapMinify );
			}
			
			var newEvent:Object = new Object();
			
			newEvent.type = "compressFail";
			newEvent.id = fileIDList[gFr];
			newEvent.fileName = gFr.name;			

			//只要出错择调用外部js处理函数
			super.dispatchEventToJavaScript(newEvent);
		}
				
		//上传压缩文件
		public function uploadFile(fileId:String):void{
		 
			var upload:URLLoader 	= new URLLoader();
			upload.dataFormat 		= URLLoaderDataFormat.BINARY;
			
			upload.addEventListener(Event.OPEN, uploadStart);			
			upload.addEventListener(Event.COMPLETE, uploadComplete);			
			upload.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, uploadCompleteData);
			upload.addEventListener(IOErrorEvent.IO_ERROR, uploadError);
			upload.addEventListener(SecurityErrorEvent.SECURITY_ERROR, uploadError);
			
			this.currentUploadThreads++;
			
			var request:URLRequest = gRequestList[fileId];
			
			//发送数据			
			upload.load(request);		  
		}		
		
		//定义全局变量存储当前文件对象相关值
		private var gFr:FileReference;
		private var gRequest:URLRequest;
		private var gVars:Object;
		private var gFieldName:String;
		
		//获取flashPlay版本号
		public function getVersion():int{			
			var versionStr:String = Capabilities.version;
			var strArr:Array = versionStr.split(",");
			var firstVersionStr:String = strArr[0];
			var strPattern:RegExp = /\d{1,2}/;  
			var mainVersion:String = strPattern.exec(firstVersionStr);
			return int(mainVersion);			
		}
		
		//异步上传入口从js中调用
		public function upload(fileID:String, url:String, method:String = "GET", vars:Object = null, fieldName:String = "Filedata"):void {

			// null checking in the params is not working correctly
			filesToUpload = [];

			if(isEmptyString(method)) {
				method = "GET";
			}
			
			if(isEmptyString(fieldName)) {
				fieldName = "Filedata";
			}

			var request:URLRequest = formURLRequest(url, method, vars);
			var fr:FileReference = fileRefList[fileID];
			
			//给全局变量赋值
			gFr = fr;
			gRequest = request;
			gVars = vars;			
			gFieldName = fieldName;
			
			// 如果是非图片类型文件不需要被压缩
			var onceCompress:Boolean = this.allowCompress;
			if ( onceCompress ) {
				var fileType:String = getFileTypeByName( fr.name );
				
				if ( fileType == 'unknown' ) {
					onceCompress = false;
				}
			}
			
			var playerVersion:int = getVersion();
			
			//判断flashPlayer版本号 版本高于10并且允许压缩则开始压缩
			if (	playerVersion >= 10 && onceCompress ) {
				//压缩开始
				compress(fr);			
			}else {
				//当版本低于10则直接上载文件用于上传
				fr.load();
			}
			
			
			
		}
		

	    /**
	     *  Uploads all files to a specified path where a script handles writing to the server.
		 *  
	     *  @param fileID The ID of the file to be uploaded
	     *  @param url The path to the serverside script
	     *  @param method The HTTP submission method. Possible values are "GET" and "POST"
	     *  @param vars An object containing data to be sent along with the request
	     *  @param fieldName The field name that precedes the file data in the upload POST operation. The uploadDataFieldName value must be non-null and a non-empty String.
	     *  @param headers An object containing variables that should be set as headers in the POST request. The following header names
	     *  cannot be used: 
	     *  <code>
	     *  Accept-Charset, Accept-Encoding, Accept-Ranges, Age, Allow, Allowed, Authorization, Charge-To, Connect, Connection, 
	     *  Content-Length, Content-Location, Content-Range, Cookie, Date, Delete, ETag, Expect, Get, Head, Host, Keep-Alive, 
	     *  Last-Modified, Location, Max-Forwards, Options, Post, Proxy-Authenticate, Proxy-Authorization, Proxy-Connection, 
	     *  Public, Put, Range, Referer, Request-Range, Retry-After, Server, TE, Trace, Trailer, Transfer-Encoding, Upgrade, 
	     *  URI, User-Agent, Vary, Via, Warning, WWW-Authenticate, x-flash-version.
	     * </code>
	     */

		public function uploadAll(url:String, method:String = "GET", vars:Object = null, fieldName:String = "Filedata", headers:Object = null):void {
			
			if(isEmptyString(method)) {
				method = "GET";
			}
			
			if(isEmptyString(fieldName)) {
				fieldName = "Filedata";
			}
			
			var request:URLRequest = formURLRequest(url, method, vars);

			for each(var fr:FileReference in fileRefList) {
				queueForUpload(fr, request, fieldName);
			}
			
			processQueue();
		}

	    /**
	     *  Cancels either an upload of the file corresponding to a given fileID, or in the absence of the specified fileID, all active files being uploaded.
		 *  
	     *  @param fileID The ID of the file to be uploaded
	     */

		public function cancel(fileID:String = null):void {

			logMessage("Canceling upload");
			
			if (fileID == null) { // cancel all files
				for each (var item:FileReference in fileRefList) {
					item.cancel();
				}
			} 

			else { // cancel specified file
				var fr:FileReference = fileRefList[fileID];
				fr.cancel();
			}

		}



		/*
			Events
			-------------------------------
			mouseDown - fires when the mouse button is pressed over uploader
			mouseUp - fires when the mouse button is released over uploader
			rollOver - fires when the mouse rolls over the uploader
			rollOut - fires when the mouse rolls out of the uploader
			click - fires when the uploader is clicked
			fileSelect - fires when the user selects one or more files (after browse is called). Passes the array of currently selected files (if prior browse calls were made and clearFileList hasn't been called, all files the user has ever selected will be returned), along with all information available about them (name, size, type, creationDate, modificationDate, creator). 
			uploadStart - fires when a file starts uploading. Passes a file id for identifying the file.
			uploadProgress - fires when a file upload reports progress. Passes the file id, as well as bytesUploaded and bytesTotal for the given file.
			uploadComplete - fires when a file upload is completed successfully and passes the corresponding file id.
			uploadCompleteData - fires when data is received from the server after upload and passes the corresponding file id and the said data.
			uploadError - fires when an error occurs during download. Passes the id of the file that was being uploaded and an error type.
		*/

		private function transparentDown (event:MouseEvent) : void {
			logMessage("Mouse down on the uploader.");
			var newEvent:Object = new Object();
			newEvent.type = "mouseDown";
			super.dispatchEventToJavaScript(newEvent);
		}

		private function transparentUp (event:MouseEvent) : void {
			logMessage("Mouse up on the uploader.");
			var newEvent:Object = new Object();
			newEvent.type = "mouseUp";
			super.dispatchEventToJavaScript(newEvent);
		}

		private function transparentRollOver (event:MouseEvent) : void {
			logMessage("Mouse rolled over the uploader.");
			var newEvent:Object = new Object();
			newEvent.type = "rollOver";
			super.dispatchEventToJavaScript(newEvent);
		}
		
		private function transparentRollOut (event:MouseEvent) : void {
			logMessage("Mouse rolled out the uploader.");
			var newEvent:Object = new Object();
			newEvent.type = "rollOut";
			super.dispatchEventToJavaScript(newEvent);
		}
		
		private function transparentClick (event:MouseEvent) : void {
			logMessage("Mouse clicked on the uploader.");
			var newEvent:Object = new Object();
			newEvent.type = "click";
			super.dispatchEventToJavaScript(newEvent);
		}
		
		//文件加载开始
		private function loadStart (event:Event) : void {
			logMessage("Started load for " + fileIDList[event.target]);
			var newEvent:Object = new Object();
			newEvent.id = fileIDList[event.target];
			newEvent.type = "loadStart";
            super.dispatchEventToJavaScript(newEvent);
		}

		
		//文件加载过程
		private function loadProgress (event:ProgressEvent) : void {
			logMessage("Progress for " + fileIDList[gFr] + ": " + event.bytesLoaded.toString() + " / " + event.bytesTotal.toString());
			var newEvent:Object = new Object();
			newEvent.id = fileIDList[gFr];
			newEvent.bytesLoaded = event.bytesLoaded;
			newEvent.bytesTotal = event.bytesTotal;
			newEvent.type = "loadProgress";
			newEvent.fileName = gFr.name;
			var loadCurrentTime:int = getTimer();
			super.dispatchEventToJavaScript(newEvent);
		}
		
		
		//文件类型判断
		private function getFileTypeByName( fileName:String ) : String {
  			var fileType:String = "unknown";
			
			if(fileName.lastIndexOf('.') != -1){
				var results:Array = fileName.split('.'); 
				var typeName:String = results.pop();
				var tmpTypeName:String = typeName.toLocaleLowerCase();
				
				if( tmpTypeName == 'jpg' ) {
					fileType = "JPG";
				}else if( tmpTypeName == 'jpeg' ) {
					fileType = "JPEG";
				}else if( tmpTypeName == 'png' ) {
					fileType = "PNG";
				}else if( tmpTypeName == 'gif' ) {
					fileType = "GIF";
				}else if( tmpTypeName == 'bmp' ) {
					fileType = "BMP";
				}
			}
			
			return fileType;		
  		}
		
		//文件类型判断
		private function getFileType(fileData : ByteArray) : String {
  			 var b0 : int = fileData.readUnsignedByte();
  			 var b1 : int = fileData.readUnsignedByte();
  			 var fileType : String = "unknown";
   			 if(b0 == 66 && b1 == 77) {
   				 fileType = "BMP";
   			 }else if(b0 == 255 && b1 == 216) {
   				 fileType = "JPG";
   			 }else if(b0 == 137 && b1 == 80) {
  				 fileType = "PNG";
  			 }else if(b0 == 71 && b1 == 73) {
    			 fileType = "GIF";
   			 }
  			 return fileType;
  		}
		
		//文件上载完成
		private function fileLoadComplete (event:Event) : void {
			// 如果是非图片类型文件不需要被压缩
			var onceCompress:Boolean = this.allowCompress;
			
			//文件类型检测
			//event.target.data as ByteArray
			var fileType:String = getFileType(event.target.data);
			if( onceCompress ){
				if(fileType == 'BMP' || fileType == 'unknown'){
					if(fileType == 'BMP'){
						//类型错误
						var newEvent:Object = new Object();			
						newEvent.type = "compressFail";
						newEvent.id = fileIDList[gFr];
						newEvent.fileName = gFr.name;			
						newEvent.failType = "fileTypeError";
						//只要出错择调用外部js处理函数
						super.dispatchEventToJavaScript(newEvent);
						return;
					}
					
					onceCompress = false;
				}
			}
			//版本检测
			var playerVersion:int = getVersion();
			
			//如果flash player 的版本低于 10.0 或者 不允许压缩 则直接上传
			//低于10.0不会运行压缩类，会把当前文件上载 fr.load()为了上载完成后获取fr.data数据用于直接上传
			//因为压缩类内部调用了当前文件的上载方法load 也会触发此函数，所以需要加版本判断和upload函数里的对应
			if(playerVersion < 10 || !onceCompress){			
				var request:URLRequest = gRequest;
				request = createRequest(gFr.name, event.target.data as ByteArray, gFieldName, "fname", gVars);
				var fileId:String = fileIDList[gFr];			
				gRequestList[fileId] = request;
				//校验 uploadValidate会通过js触发uploadFile
				uploadValidate();
				//uploadFile(fileId);
			}
		}
		
		//上传校验
		private function uploadValidate():void{			
			logMessage("Started uploadValidate for " + fileIDList[gFr]);
			var newEvent:Object = new Object();
			newEvent.id = fileIDList[gFr];
			newEvent.type = "uploadValidate";
			newEvent.fileData = gFr;
            super.dispatchEventToJavaScript(newEvent);
		}
		
		//上传开始
		private function uploadStart (event:Event) : void {
			logMessage("Started upload for " + fileIDList[gFr]);
			var newEvent:Object = new Object();
			newEvent.id = fileIDList[gFr];
			newEvent.type = "uploadStart";
            super.dispatchEventToJavaScript(newEvent);
		}

		//上传完成
		private function uploadComplete (event:Event) : void {
			logMessage("Upload complete for " + fileIDList[gFr]);
			var newEvent:Object = new Object();
			newEvent.id = fileIDList[gFr];
			newEvent.type = "uploadComplete"
			super.dispatchEventToJavaScript(newEvent);

			this.currentUploadThreads--;
			// get next off of queue:
			
			if(filesToUpload.length > 0) {
				processQueue();
			}
			uploadCFCompleteData(event.target as URLLoader);
		}
		
		//上传压缩数据完成			
		private function uploadCFCompleteData(urlLoader:URLLoader):void{
			var loader:URLLoader = URLLoader(urlLoader);			
			var newEvent:Object = new Object();
			newEvent.id = fileIDList[gFr];
			newEvent.data = String(loader.data);			
			newEvent.type = "uploadCompleteData";			
			super.dispatchEventToJavaScript(newEvent);
		}

		private function uploadCompleteData (event:DataEvent) : void {			
			logMessage("Got data back for " + fileIDList[gFr] + ": ");
			logMessage(event.data);
			var newEvent:Object = new Object();
			newEvent.id = fileIDList[gFr];
			newEvent.data = event.data;			
			newEvent.type = "uploadCompleteData";
			super.dispatchEventToJavaScript(newEvent);
		}
		
		private function uploadCancel (event:Event) : void {			
			logMessage("Canceled upload for " + fileIDList[event.target]);
			var newEvent:Object = new Object();
			newEvent.id = fileIDList[event.target];
			newEvent.type = "uploadCancel";
			super.dispatchEventToJavaScript(newEvent);
		}


		//上传错误处理
		private function uploadError (event:Event) : void {
			
			//所有 event.target 用 全局 gFr 代替
	        var newEvent:Object = {};

			if (event is HTTPStatusEvent) {
				var myev:HTTPStatusEvent = event as HTTPStatusEvent;
				newEvent.status = myev.status;
				logMessage("HTTP status error for " + fileIDList[gFr] + ": " + myev.status);
			}

			else if (event is IOErrorEvent) {
				newEvent.status = event.toString();
				logMessage("IO error for " + fileIDList[gFr] + ". Likely causes are problems with Internet connection or server misconfiguration.");
			}

			else if (event is SecurityErrorEvent) {
				newEvent.status = event.toString();
				logMessage("Security error for " + fileIDList[gFr]);
			}

			newEvent.type = "uploadError";
			newEvent.id = fileIDList[gFr];
			
			//只要出错择调用外部js处理函数
			super.dispatchEventToJavaScript(newEvent);



			// get next off of queue:

			if(filesToUpload.length > 0) {
				processQueue();
			}

		}



		// Fired when the user selects a single file 单选
		private function singleFileSelected(event:Event):void {
			this.clearFileList();
			addFile(event.target as FileReference);
			processSelection();
		}



		// Fired when the user selects multiple files 多选
		private function multipleFilesSelected(event:Event):void {
			var currentFRL:FileReferenceList = multipleFiles;
			for each (var currentFR:FileReference in currentFRL.fileList) {
				addFile(currentFR);
			}
			processSelection();
		}
		
		private function renderAsButton (buttonSkinSprite:String) : void {
		
			
			buttonSkin.load(new URLRequest(buttonSkinSprite));
			var _this:Uploader = this;
			
			var initLoader:Function = function (event:Event) : void {
				buttonSprite.addChild(buttonSkin);
				
				buttonHeight = buttonSkin.height/4;
				buttonWidth = buttonSkin.width;
				
				var buttonMask:Sprite = new Sprite();
				buttonMask.graphics.beginFill(0x000000,1);
				buttonMask.graphics.drawRect(0,0,buttonWidth,buttonHeight);
				buttonMask.graphics.endFill();
				
				_this.addChild(buttonMask);
				buttonSprite.mask = buttonMask;
				
				function buttonStageResize (evt:Event) : void {
		 		buttonSprite.width = buttonSprite.stage.stageWidth;
		 		buttonSprite.height = buttonSprite.stage.stageHeight*4;
		 		buttonMask.width = _this.stage.stageWidth;
		 		buttonMask.height = _this.stage.stageHeight;
		 		};
		 	
				buttonSprite.width = _this.stage.stageWidth;
				buttonSprite.height = _this.stage.stageHeight*4;
				buttonMask.width = _this.stage.stageWidth;
				buttonMask.height = _this.stage.stageHeight;
				
				_this.stage.scaleMode = StageScaleMode.NO_SCALE;
				_this.stage.align = StageAlign.TOP_LEFT;
				_this.stage.tabChildren = false;
			
				_this.stage.addEventListener(Event.RESIZE, buttonStageResize);
				
				_this.addEventListener(MouseEvent.ROLL_OVER, buttonMouseOver);
				_this.addEventListener(MouseEvent.ROLL_OUT, buttonMouseOut);
				_this.addEventListener(MouseEvent.MOUSE_DOWN, buttonMouseDown);
				_this.addEventListener(MouseEvent.MOUSE_UP, buttonMouseUp);
				_this.addEventListener(MouseEvent.CLICK, handleMouseClick);
				
				_this.stage.addEventListener(KeyboardEvent.KEY_DOWN, handleKeyDown);
				_this.stage.addEventListener(KeyboardEvent.KEY_UP, handleKeyUp);
			

				_this.addChild(buttonSprite);	
			}
			
			var errorLoader:Function = function (event:IOErrorEvent) : void {
				renderAsTransparent();
			}
			
			buttonSkin.contentLoaderInfo.addEventListener(Event.COMPLETE, initLoader);	
			buttonSkin.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, errorLoader);

		}

		private function buttonMouseOver (event:MouseEvent) : void {
					buttonSkin.y = -1*buttonHeight;
		}
				
		private function buttonMouseOut  (event:MouseEvent) : void {
					buttonSkin.y = 0;
		}
				
		private function buttonMouseDown  (event:MouseEvent) : void {
					buttonSkin.y = -2*buttonHeight;
		}
				
		private function buttonMouseUp (event:MouseEvent) : void {
					buttonSkin.y = 0;
		}
				
		private function renderAsTransparent () : void {
		 	
		 	function transparentStageResize (evt:Event) : void {
		 		buttonSprite.width = buttonSprite.stage.stageWidth;
		 		buttonSprite.height = buttonSprite.stage.stageHeight;
		 	}
		 	
			buttonSprite.graphics.beginFill(0xffffff, 0);
			buttonSprite.graphics.drawRect(0,0,5,5);
			buttonSprite.width = this.stage.stageWidth;
			buttonSprite.height = this.stage.stageHeight;
			buttonSprite.graphics.endFill();
			this.stage.scaleMode = StageScaleMode.NO_SCALE;
			this.stage.align = StageAlign.TOP_LEFT;
			this.stage.tabChildren = false;
			
			this.stage.addEventListener(Event.RESIZE, transparentStageResize);
			
			this.addEventListener(MouseEvent.CLICK, handleMouseClick);
			this.addEventListener(MouseEvent.CLICK, transparentClick);
			
			this.addEventListener(MouseEvent.MOUSE_DOWN, transparentDown);
			this.addEventListener(MouseEvent.MOUSE_UP, transparentUp);
			this.addEventListener(MouseEvent.ROLL_OVER, transparentRollOver);
			this.addEventListener(MouseEvent.ROLL_OUT, transparentRollOut);
			
			this.buttonMode = true;
			this.useHandCursor = true;
			this.addChild(buttonSprite);
		}
		
		private function handleKeyDown (evt:KeyboardEvent) : void {
			if (evt.keyCode == Keyboard.ENTER || evt.keyCode == Keyboard.SPACE) {
				logMessage("Keyboard 'Enter' or 'Space' down.");
				buttonSkin.y = -2*buttonHeight;
			}	
		}
		
		private function handleKeyUp (evt:KeyboardEvent) : void {
			if (evt.keyCode == Keyboard.ENTER || evt.keyCode == Keyboard.SPACE) {
				buttonSkin.y = 0;
				logMessage("Keyboard 'Enter' or 'Space' up.");
				logMessage("Keyboard 'Enter' or 'Space' detected, launching 'Open File' dialog.");
				this.browse(this.allowMultiple, this.filterArray);
			}
		}
		
		private function handleFocusIn (evt:FocusEvent) : void {
			logMessage("Focus is on the Uploader.");
		}
		
		private function handleFocusOut (evt:FocusEvent) : void {
			logMessage("Focus is out on the Uploader.");
		}


		private function handleMouseClick (evt:MouseEvent) : void {
			logMessage("Mouse click detected, launching 'Open File' dialog.");
			this.browse(this.allowMultiple, this.filterArray);
		}

		//--------------------------------------------------------------------------
		// 
		// Overridden Properties
		//
		//--------------------------------------------------------------------------

	    /**
		 *  @private
		 *  Initializes the component and enables communication with JavaScript
	     *
	     *  @param parent A container that the PopUpManager uses to place the Menu 
	     *  control in. The Menu control may not actually be parented by this object.
	     * 
	     *  @param xmlDataProvider The data provider for the Menu control. 
	     *  @see #dataProvider 
	     *  
	     *  @return An instance of the Menu class. 
	     *
	     *  @see #popUpMenu() 初始化组件，添加外部接口，初始化公共属性
		 *  @see com.yahoo.astra.fl.data.XMLDataProvider
	     */

		override protected function initializeComponent():void {

			super.initializeComponent();
			var btnSkinURL:String;
			btnSkinURL = this.stage.loaderInfo.parameters["buttonSkin"];
			
			if (btnSkinURL != null) {
				this.renderType = "button";
				this.renderAsButton(btnSkinURL);
			}
			else {
				this.renderType = "transparent";	
				this.renderAsTransparent();
			}			
		 	
		 	// removeFile (fileID:String = null) 
		 	// Removes one or all files from the upload queue
			ExternalInterface.addCallback("removeFile", removeFile);
			
			// clearFileList (): Boolean
			// Clears the list of files to be uploaded.
			ExternalInterface.addCallback("clearFileList", clearFileList);
			
			// upload(fileID:String, url:String, method:String = "GET", vars:Object = null, fieldName:String = "Filedata")
			// Uploads the specified file in a specified POST variable, attaching other variables using the specified method
			ExternalInterface.addCallback("upload", upload);
			
			// uploadAll(url:String, method:String = "GET", vars:Object = null, fieldName:String = "Filedata")
			// Uploads all files in the queue, using simultaneousUploads.
			ExternalInterface.addCallback("uploadAll", uploadAll);
			
			// cancel (fileID:String = null) 
			// Cancels the specified file upload; or all, if no id is specified
			ExternalInterface.addCallback("cancel", cancel);
			
			// setAllowLoging (allowLogging:Boolean = false)
			// Allows log outputs to be produced.
			ExternalInterface.addCallback("setAllowLogging", setAllowLogging);
			 
			// setAllowMultipleFiles (allowMultiple:Boolean = false)
			// Allows multiple file selection
			ExternalInterface.addCallback("setAllowMultipleFiles", this.setAllowMultipleFiles);
			
			// setSimUploadLimit(simUpload:int = [2,5])
			// Sets the number of simultaneous uploads allowed when automatically managing queue.
			ExternalInterface.addCallback("setSimUploadLimit", this.setSimUploadLimit);
			
			// setTimerOut(time:uint) 添加设置超时时间外部接口
			ExternalInterface.addCallback("setTimerOut", this.setTimerOut);
			
			// setCompressCompleteSize(compressMinSize:int) 添加设置压缩后最小值接口
			ExternalInterface.addCallback("setCompressCompleteSize", this.setCompressCompleteSize);
			
			// setRiseCount(count:int) 添加设置压缩质量递减增量
			ExternalInterface.addCallback("setRiseCount", this.setRiseCount);
						
			// setAllowCompress(allowCompress:Boolean) 设置是否允许压缩
			ExternalInterface.addCallback("setAllowCompress", this.setAllowCompress);
			
			// setCompressSize(compressWidth:int,compressHeight:int) 设置压缩高宽
			ExternalInterface.addCallback("setCompressSize", this.setCompressSize);
			
			// setQuality(quality:int) 设置压缩高宽
			ExternalInterface.addCallback("setQuality", this.setQuality);
			
			// uploadFile(fileId:String) 文件上传
			ExternalInterface.addCallback("uploadFile", this.uploadFile);
						
			// setFileFilters(fileFilters:Array)
			// Sets file filters for file selection.
			ExternalInterface.addCallback("setFileFilters", this.setFileFilters);
			
			// enable()
			// Enables Uploader UI
			ExternalInterface.addCallback("enable", enable);
			
			// disable()
			// Disables Uploader UI
			ExternalInterface.addCallback("disable", disable);

			// Initialize properties.
			fileDataList = new Object();
			fileRefList = new Object();
			fileIDList = new Dictionary();
			gRequestList = new Object();
			singleFile = new FileReference();
			multipleFiles = new FileReferenceList();

			fileIDCounter = 0;

			filesToUpload = [];

		}

	

		//--------------------------------------
		//  Private Methods
		//--------------------------------------

		/**
		 *  @private
		 *  Formats objects containing extensions of files to be filtered into formal FileFilter objects
		 */	

		private function processFileFilterObjects(filtersArray:Array) : Array {

			// TODO: Should we have an 'allowedExtensions' property that the JS user accesses directly? Potential here for typos ('extension' instead of 'extensions') as well as a misunderstanding of the nature of the expected array
			// TODO: Description not showing (testing on OS X PPC player)
			for (var i:int = 0; i < filtersArray.length; i++) {
				filtersArray[i] = new FileFilter(filtersArray[i].description, filtersArray[i].extensions, filtersArray[i].macType);
			}

			return filtersArray;
		}

		/**
		 *  @private 文件选择后把信息传递到 javaScript 函数中校验 通过择开始上传（压缩） 
		 *  Outputs the files selected to an output panel and triggers a 'fileSelect' event.
		 */	

		private function processSelection():void {

			var dstring:String = "";
			dstring += "Files Selected: \n";

			for each (var item:Object in fileDataList) {
				dstring += item.name + "\n ";
			}

			logMessage(dstring);

			var newEvent:Object = new Object();
			newEvent.fileList = fileDataList;
			newEvent.type = "fileSelect";
			
			//javaScript校验文件信息
			super.dispatchEventToJavaScript(newEvent);
		}

		

		/**
		 *  @private
		 *  Adds a file reference object to the internal queue and assigns listeners to its events
		 */	
		//添加文件信息存储到全局数组
		private function addFile(fr:FileReference):void {
			//文件号
			var fileID:String = "file" + fileIDCounter;
			//文件名
			var fileName:String = fr.name;
			//文件创建日期
			var fileCDate:Date = fr.creationDate;
			//文件修改日期
			var fileMDate:Date = fr.modificationDate;
			//文件大小
			var fileSize:Number = fr.size;
			//文件计数器
			fileIDCounter++;
			//把数据转为josn对象然后存储到fileDataList全局数组中
			fileDataList[fileID] = {id: fileID, name: fileName, cDate: fileCDate, mDate: fileMDate, size: fileSize};//, type: fileType, creator: fileCreator};

			fr.addEventListener(Event.OPEN, loadStart); 									//load开始
           	fr.addEventListener(ProgressEvent.PROGRESS, loadProgress);				   //load过程
			fr.addEventListener(Event.COMPLETE, fileLoadComplete);						  //load完成
			//fr.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, uploadCompleteData);	 //上传完成返回数据
			fr.addEventListener(HTTPStatusEvent.HTTP_STATUS, uploadError);				//上传失败 HTTP 错误
	        fr.addEventListener(IOErrorEvent.IO_ERROR, uploadError); 				   //上传IO 接口错误
           	fr.addEventListener(SecurityErrorEvent.SECURITY_ERROR, uploadError);	  //上传安全错误
			fr.addEventListener(Event.CANCEL,uploadCancel);						 	 //取消上传
			
			//把文件对象存储到全局数组fileRefList中键值为fileID;
			fileRefList[fileID] = fr;
			//把文件id存储到全局数组fileIDList中键值为fr;
			fileIDList[fr] = fileID;
		}

		/**
		 *  @private
		 *  Queues a file for upload 添加文件上传相关对象信息到队列全局数组filesToUpload中
		 */	
		private function queueForUpload(fr:FileReference, request:URLRequest, fieldName:String):void {
			filesToUpload.push( {fr:fr, request:request, fieldName:fieldName });
		}

		/**
		 *  @private
		 *  Uploads the next file in the upload queue. 核心文件上传（压缩）队列处理/异步组件里没用用到
		 */	

		private function processQueue():void {

		while (this.currentUploadThreads < this.simultaneousUploadLimit) {
			var objToUpload:Object = filesToUpload.pop();
			var fr:FileReference = objToUpload.fr;
			var request:URLRequest = objToUpload.request;
			var fieldName:String = objToUpload.fieldName;

			fr.upload(request,fieldName);
			this.currentUploadThreads++;
		}
		}

		/**
		 *  @private http URL 请求参数设置 新参数设置函数为 createRequest
		 *  Creates a URLRequest object from a url, and optionally includes an HTTP request method and additional variables to be sent
		 */	

		private function formURLRequest(url:String, method:String = "GET", vars:Object = null):URLRequest {

			var request:URLRequest = new URLRequest();
			request.url = url;
			request.method = method;
			request.data = new URLVariables();
			

			for (var itemName:String in vars) {
				request.data[itemName] = vars[itemName];
			}


			return request;
		}

		/**
		 *  @private
		 *  Determines whether an object is equivalent to an empty string
		 */	

		private function isEmptyString(toCheck:*):Boolean {

			if(	toCheck == "null" ||
				toCheck == "" ||
				toCheck == null ) {

				return true;
			}

			else {
				return false;
			}
		}
		
		private function logMessage (message:String) : void {
			if (this.allowLog) {
				trace(message);
				ExternalInterface.call(this.javaScriptEventHandler.toString()+'.log', message);
			}
		}

	}

}

