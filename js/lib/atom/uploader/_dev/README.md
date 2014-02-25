# 文件异步上传核心

---------------

提供文件上传的通用解决方案.用户可以根据需求在核心组件上面定制UI,配置优先上传方式,或者禁用某种上传方式.支持的上传方式有Flash,HTML5和iframe (iframe上传方式无法禁用,是所有上传方式的备用方案)
针对国际站的DPL,提供了相应的UI,详见 /6v/biz/common/uploader/

`` 使用HTML5上传需要保证上传路径和页面路径在通一个域名下面! 否则需要服务器配置转发规则.``

apache virtualhost 配置示例如下:
RewriteRule ^/mupload/$    $uploadServer/mupload [L,P]

关于 apache rewrite 参考
http://httpd.apache.org/docs/2.2/rewrite/flags.html

在使用flash上传的时候需要在域名下面配置crossdomain.xml
关于crossdomain.xml的配置 参考
http://www.adobe.com/devnet-docs/acrobatetk/tools/AppSec/CrossDomain_PolicyFile_Specification.pdf
或者参考国际站的crossdomain.xml的配置
http://upload.alibaba.com/crossdomain.xml

## 文件异步上传配置详解

* uploaderButton: 触发异步上传的button按钮
* multiple：是否允许多选
* runtimes:上传优先级,两种可选'HTML5,FLASH'.靠前的优先选择.为了保证安全,如果浏览器两种方式均不支持,则使用iframe的方式上传
* dragContainer: 拖拽上传的响应区域.不配置或者为空则不支持拖拽上传. 
* uploadURL: 上传文件的URL,为了保证跨域的提交,推荐使用相对路径.
* fileTypes: 文件类型设置,分号分割,例如: *.jpg;*.png. *.* 代表不限制文件类型.
* fileSizeLimit: 文件大小限制.例如 300KB
* fileUploadLimit: 最多上传文件个数.默认值为0,表示无限制.
* postParams: 随文件上传还需要的Post的数据.例如:{rule:'wsrule'}
* flashUrl: flash上传swf文件的地址


## 提供接口 
    getType: 返回当前上传的类型
    cancelAll: 取消所有上传
    cancel: 取消上传,参数为文件ID,文件ID会在一些自定义事件的参数中获得.
    remove: 删除一个文件时设置处理内部计数器.(服务器端不做任何处理.)
    getUploadedCount: 已经上传了多少个文件
    addExistFile: 添加一个已经上传好的文件.(上传组件处在编辑状态)


## 触发方法 
* error: 文件队列上传错误时的事件. 
    * 对象分别为 file, errorCode, message
    * errorCode含义
        * -100:超出队列允许最大文件数;
        * -110:文件大小超标;
        * -120:文件为0字节;
        * -130:文件类型错误;
        * -240:超出最大上传限制;
* queue: 文件进入上传队列时的事件.
* start: 文件上传开始时的事件.
* success: 文件上传成功时的事件.
* complete: 文件全部上传成功的事件
* error: 文件上传失败时的事件.
* remove: 删除已经上传文件的事件.
* progress: 文件上传中的事件.不同浏览器调用方法的频率不同. (可选)
    * 参数分别为:file, bytesLoaded, bytesTotal
        * bytesLoaded 已上传字节
        * bytesTotal 总共文件字节
* dragEnter: 拖拽文件进入区域的事件
* dragLeave: 拖拽文件离开区域的事件
* dragOver:拖拽文件在区域移动的事件

## 服务器端对于请求的处理
* name: 文件名
* file: 文件对象

## 关于

### 版本:0.0.1

### 开发人员:

```贺鹏(peng.hep@alibaba-inc.com)```
