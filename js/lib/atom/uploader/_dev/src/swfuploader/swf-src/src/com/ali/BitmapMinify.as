package com.ali
{
	import com.ali.JPGEncoderIMP;
	import flash.display.BitmapData;
	import flash.display.Loader;
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.net.FileReference;
	import flash.utils.*;
	
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.geom.Matrix;
	
	/**
	 * 图片文件压缩工具
	 * @author qhwa, <http://china.alibaba.com>
	 */
	public class BitmapMinify extends EventDispatcher
	{
		
		private var srcBMD:BitmapData;
		private var outBMD:BitmapData;
		private var loader:Loader;
		private var jpgEecoder:JPGEncoderIMP;
		//private var file:FileReference;
		private var mw:int;
		private var mh:int;
		
		private var quality:int = 80;
		
		private var timeOut:uint = 30000;
		private var timeoutId:uint;
		public var output: ByteArray = new ByteArray();
		
		//for debug
		private var cHeight:int;
		private var cWidth:int;
		public var debugStr:String;
		
		/**
		 * constructor
		 */
		public function BitmapMinify(quality:int,timeOut:uint):void
		{	

			setTimeOut(timeOut);

			//初始化图片质量值
			if(quality){
				this.quality = quality;
			}			
			//创建一个文件加载类
			loader = new Loader();
			//debugStr = String(timeOut);
			//给正在加载的对象完成事件添加事件函数
			loader.contentLoaderInfo.addEventListener( Event.COMPLETE, bmpDecoded );
			//失败事件添加事件函数，加载文件失败后添加失败事件(会造成稳定性问题)
			//loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, decodeFail );
			
			
			//新建一个图片压缩类赋给jpgEecoder
			jpgEecoder = new JPGEncoderIMP();
			jpgEecoder.setQuality(quality);
			jpgEecoder.init();

			//添加压缩进度事件函数
			jpgEecoder.addEventListener( "progressing", decodeProgress);
			jpgEecoder.addEventListener( "compressTimeOut", onTimeOut);
			//添加压缩完成事件函数，压缩完成后
			jpgEecoder.addEventListener( Event.COMPLETE, decodeComplete);
		}
		
		private function clearJpgEecoder(jpgEecoderObj:JPGEncoderIMP):void{			
			jpgEecoderObj.removeEventListener(Event.COMPLETE , decodeComplete);
			jpgEecoderObj.removeEventListener("compressTimeOut", onTimeOut);
			jpgEecoderObj.removeEventListener("progressing", decodeProgress);
		}
		
		//for debug
		private function setCompressWidth(width:int):void{ cWidth = width;}
		private function setCompressHeight(height:int):void{ cHeight = height;}
		public function getCompressWidth():int{return cWidth;}
		public function getCompressHeight():int{return cHeight;}
	
		
		//设置超时时间
		public function setTimeOut(time:uint):void{
			if(time){
				timeOut = time;				
			}
		}
		
		/**
		 * 压缩
		 * @param	f	文件对象
		 * @param	max_width	压缩后图片最大宽度
		 * @param	max_height 	压缩后图片最大高度
		 */
		//对象主接口及入口
		public function minify( f : FileReference , max_width:int, max_height:int) : void {
						
			//设置超时时间
			jpgEecoder.setTimeOut(timeOut);
			
			mw = max_width;
			mh = max_height;

			//给文件对象添加事件
			addListener( f );
			
			//加载文件，加载后触发之前添加的事件函数
			f.load();
		}
		
		private function addListener( f:FileReference ):void
		{
			//文件上载完成后，文件加载
			f.addEventListener(Event.COMPLETE , fileLoaded);
			f.addEventListener(IOErrorEvent.DISK_ERROR, fileLoadError);
			f.addEventListener(IOErrorEvent.IO_ERROR, fileLoadError);
			f.addEventListener(IOErrorEvent.NETWORK_ERROR, fileLoadError);
			f.addEventListener(IOErrorEvent.VERIFY_ERROR, fileLoadError);
		}
		
		private function removeListener( f:FileReference ):void
		{
			f.removeEventListener(Event.COMPLETE , fileLoaded);
			f.removeEventListener(IOErrorEvent.DISK_ERROR, fileLoadError);
			f.removeEventListener(IOErrorEvent.IO_ERROR, fileLoadError);
			f.removeEventListener(IOErrorEvent.NETWORK_ERROR, fileLoadError);
			f.removeEventListener(IOErrorEvent.VERIFY_ERROR, fileLoadError);
		}
		
		
		private function fileLoaded(e:Event = null) : void {
			//var fr:FileReference = e.target as FileReference;
			
			//加载字节流，加载后触发之前loader对象初始化的事件函数
			loader.loadBytes( e.target.data );
			
			//成功则清除当前对象的事件处理函数
			removeListener(e.target as FileReference);
		}
		
		private function fileLoadError(e:Event=null):void
		{		
			var fr:FileReference = e.target as FileReference;
			removeListener(fr);
			//压缩失败
			decodeFail();
		}
		
		
	  /**
	   * 尺寸压缩后开始异步压缩
	   * @author qhwa, <http://china.alibaba.com>	 
	   */
		private function bmpDecoded(e:Event):void {
			
			var nH:int,nW:int,h:int,w:int;
			var loaderData:Loader = Loader(e.target.loader);
			var image:Bitmap = Bitmap(loaderData.content);
			var myMatrix:Matrix = new Matrix(1,0,0,1,0,0);
			
			//获取当前加载对象的高和宽
			w = image.bitmapData.width;
			h = image.bitmapData.height;
			
			//计算压缩到设定高宽的比例
			var rate:Number = Math.min(1, Math.min( mw / w, mh / h ));
			nW = int(w * rate);
			nH = int(h * rate);
			myMatrix.scale(rate,rate);
			setCompressWidth(nW);
			setCompressHeight(nH);
			var myBitmapData:BitmapData = new BitmapData(nW,nH);
			myBitmapData.draw(image.bitmapData,myMatrix,null,null,null,true);			
			
			try {				
				
				srcBMD = image.bitmapData;
				
				if (rate < 1)
				{
					//如果图片大于设定的高宽则返回尺寸压缩后的值
					outBMD = myBitmapData;
				} else {
					//否则原样输出
					outBMD = srcBMD;
				}
				//完成尺寸压缩后，开始异步质量压缩，压缩后触发之前对其添加的事件函数
				jpgEecoder.encodeAsync( outBMD );
				
				
			} catch (err:Error) {
				//debugStr = "toTryError";
				//出错则新增错误处理事件
				var evt:Event = new Event("compressFail");
				dispatchEvent(evt);
			}
			
		}
		
		//进度函数，把之前调用此方法对象的进度时间继续广播到此对象
		private function decodeProgress(e:ProgressEvent = null):void {
			dispatchEvent(e);
		}
		
		private function decodeComplete(e:Event = null):void {			

			//压缩完成后新建完成事件
			var evt:Event = new Event(Event.COMPLETE);
			//清除临时图片数据
			srcBMD.dispose();
			outBMD.dispose();			
			output.clear();
			//写入字节，获取异步质量压缩返回的数据，赋给公用变量output
			output.writeBytes(e.target.ba as ByteArray, 0, ByteArray(e.target.ba).bytesAvailable);
			dispatchEvent(evt);
			
		}
		
		private function decodeFail(e:Event = null):void
		{
			//debugStr = "IO Error";
			//此处和catch处只有一处会执行不会重复
			var evt:Event = new Event("compressFail");
			dispatchEvent(evt);			
		}
		
		private function onTimeOut(e:Event = null):void{			
			var evt:Event = new Event("compressTimeOut");
			dispatchEvent(evt);			
		}
		
	}
	
	
}