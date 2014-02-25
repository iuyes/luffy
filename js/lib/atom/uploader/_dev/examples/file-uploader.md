# 文件上传

- order: 3

---

````iframe:1000 

<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/core/core-sc.css" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/button/button-sc.css" />

<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/assets/progressbar/progressbar-sc.css" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/assets/uploader/uploader-sc.css" />


<style>
  .demo{border:1px solid #eee;padding:10px;width:950px;margin-bottom:20px;}
</style>

</head>
<body>


<div class="grid-c">
  <p style="border:1px solid #999;padding:10px;line-height:20px;">
      <a href="http://dpl.aliui.com/?cat=60" target="_blank">Alibaba 上传组件DPL</a> <br>
      Demo 展示了普通文件上传的DPL样式及其功能.详细配置请查看页面源码.<br />
      <span style="color:red"><strong>注意:</strong>异步上传强依赖swfupload.js 并且不支持封装成seaJS模块的形式.</span><br />
      理由是swfupload提供的方法是给Flash调用的,封装到闭包毫无意义.
      因此需要在页面合适的位置合适的方式引入:<br />
      http://style.aliunicorn.com/6v/common/async-uploader/swfupload.js <br />
      需要绑定host: <br><br>
      127.0.0.1 style.alibaba.com style.aliexpress.com img.alibaba.com style.aliunicorn.com <br><br>
      前端负责人: 贺鹏 <br>
  </p>
  
  <h2>多附件上传</h2>
  <div class="demo">
      <form method="POST" enctype="multipart/form-data" class="ui-form ui-form-horizontal">
          <div id="async-uploader-2" class="async-uploader-common-file">
              <div class="ui-form-item">
                  <label class="ui-label ui-label-horizontal">多个文件上传</label>
                  <div class="ui-form-controls">
                  	<input id="file-list" type="hidden" name="file-list" / >
                  	<input id="btn-mulit-uploader" type="button" class="ui-button ui-button-normal" value="Browse">
                    <span class="help-text">JPG, ZIP format</span>
                    
                    <div id="file-uploader-wrap"></div>
                    
                  </div>
              </div>  
          </div>                
      </form>       
      <div class="clearfix"></div>
  </div>
</div>



<script>
seajs.use(['$', 'js/6v/lib/icbu/uploader/file-uploader.js'],function($, FileUploader){
    var uploader = new FileUploader({
        //runtimes:'html5,flash',
        runtimes:'flash',
        parentNode:'#file-uploader-wrap',
        
        uploadButton: '#btn-mulit-uploader',
        
        //fileList: [{"error":false,"fileDestOrder":1,"fileFlag":"no","fileId":0,"fileName":"Chrysanthemum.jpg","fileSavePath":"/request/20/00/60/00/200060005/1352083940428_hz-rfqmyalibaba-web1_28319.jpg","fileSize":0,"fileSrcOrder":1,"fileURL":"/request/20/00/60/00/200060005/1352083940428_hz-rfqmyalibaba-web1_28319.jpg","imgURL":""}],
        inputElement: '#file-list',

        validatorConfig: [
            {
								ruleName: 'allowTypes',
								params:{ fileTypes: 'Jpg;Jpeg;Png;Gif;Tif;Bmp;Doc;Xls;Txt;Pdf;Html;Zip;Rar' },
								message: '{{fileName}} 文件类型错误'
							},
							{
								ruleName: 'fileNum',
								params:{ max: 3 },
								message: '最多只允许上传 {{max}} 个文件'
							},
							{
								ruleName: 'fileSize',
								params:{ max: 2 * 1024 * 1024 },
								message: '{{fileName}} 文件超过2M,上传失败'
							}
						],

		        //默认不需要
		        //dragContainer:'#drag-container',
		        
		       	uploadURL: 'http://upload.alibaba.com/mupload',
		       	//uploadURL: 'http://style.alibaba.com:8000/mupload',
		        postParams:{scene:'wsproductImageRule'},
		        swfURL: '../src/swfuploader/uploader.swf'
        
    });
    
    uploader.render();
    
});
</script>


````