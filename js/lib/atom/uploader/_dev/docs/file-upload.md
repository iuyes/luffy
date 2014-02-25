# 文件上传数据集

-------------------------------

## 上传队列文件数据:	
* id: 文件id   
* name: 文件名称  
* size: 文件大小  


## 文件验证：
* maxUpload: 最多允许上传的文件数
* maxSize: 文件大小限制止   
* allowTypes: 允许的文件类型  
* fileMax: 最多允许存在的文件数量 
* require: 是否必须要有一个文件  

validatorConfig: [{
	ruleName: '',
	params:{},
	message: ''	
}];



## 文件上传中过程中产生的进度数据
 * bytesLoaded 当前文件已上传字节
 * bytesTotal 当前文件总共文件字节


## 文件上传过程中发生错误时抛出的数据
	error事件触发产生的数据
		ev.status.HTTPStatusEvent: 出错类型
		ev.status.IOErrorEvent: 出错类型
		ev.status.SecurityErrorEvent: 出错类型

		ev.type: 事件类型
		ev.id: 出错文件id


## 文件上传服务器返回数据： 

参见文档: http://docs.alibaba-inc.com/pages/viewpage.action?pageId=75799212

* code	 返回码	 见下面详细说明
	0	 操作成功
	1	 IO_ERROR 通用错误码，不特殊说明的错误都属于此 
	2 FORMAT_ERROR 
		文件内容读取错误，包括不符合声明的文件格式 
	3 FILE_SIZE_ERROR 文件大小与配置不符，包括服务端设置为“不自动缩略”时，文件尺寸超过限制 
	4 FILE_TYPE_ERROR 文件类型（后缀）与配置不符

* url 当前上传文件临时预览url,会不定期清理文件,因前端组件的要求，url后带上了其他4个信息
* fs_url	 当前上传文件在服务端的资源路径	 用于后续请求在服务端对该上传文件的操作 
* size	 文件上传后的大小	 单位字节
* height	 文件上传后的高度	 如果是图片，包含这一项，单位像素；如果不是图片，则为0；
* width	 文件上传后的宽度	 如果是图片，包含这一项，单位像素；如果不是图片，则为0；
* hash	 文件上传后返回的hash值	 

## 文件上传状态
文件上传所有的状态  

	status:{  
		WAITING:'waiting',  
		START:'start',  
		PROGRESS:'progress', 
		SUCCESS:'success',  
		CANCEL:'cancel',  
		ERROR:'error',  
		RESTORE:'restore'  
	}