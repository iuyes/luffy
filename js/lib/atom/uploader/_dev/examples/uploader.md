# 文件上传基础类

- order: 2

---

````iframe:1000 
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/core/core-sc.css" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/button/button-sc.css" />

<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/assets/progressbar/progressbar-sc.css" />
<link rel="stylesheet" href="http://style.aliunicorn.com/css/6v/apollo/mod/assets/uploader/uploader-sc.css" />

<div class="grid-c">
  <div id="file-uploader">
      <input type="button" class="ui-button ui-button-normal-s" id="upload-button" value="Browse" />
      <br /><br />
      <p id="drag-container" style="height:300px;border:1px solid #000;">仅HTML5上传方式且正确配置以后才支持从外部拖拽文件到此区域.调试信息请打开console面板.</p>
  </div>
</div>

<script>
  seajs.use('js/6v/lib/icbu/uploader/uploader.js',function(Uploader){
    var u = new Uploader({
        //runtimes:'html5,flash',
        //runtimes:'flash',
        runtimes:'flash',
        multiple: true,
        element:'#file-uploader',
        uploadButton: '#upload-button',
        
        //默认不需要
        //dragContainer:'#drag-container',
        uploadURL: 'http://upload.alibaba.com/fileupload',
        fileTypes: '*.jpg;*.png',
        fileSizeLimit: '5000KB',
        postParams:{rule:'portraitImageRule'},
        swfURL: '../src/swfuploader/uploader.swf'
    });

    // 如果不需要拖拽上传,则不需要监听下面的关于拖拽的事件
    u.on('dragEnter',function(args){
        console.log('dropEnter');
    });
    u.on('dragLeave',function(args){
        console.log('dropLeave');
    });
    u.on('dragOver',function(args){
        console.log('dropOver');
    });
    u.on('fileDrop',function(args){
        console.log('dropDrop');
    });
    // 拖拽上传相关事件结束
    

    u.on('fileSelect',function(args){
        console.log('fileSelect');
    });
    
    u.on('ready',function(args){
      console.log('ready');
    });

    u.on('start',function(args){
        console.log('start');
    });
    u.on('complete',function(args){
        console.log('complete');
        console.log(args);
    });

    u.on('completeAll',function(args){
        console.log('completeAll');
    });

    u.on('progress',function(args){
        console.log('progress');
        console.log(args);
    });

    u.on('error',function(args){
        console.log('error');
        console.log(args);
    });
    u.on('cancel',function(args){
        console.log('cancel');
    });
    u.on('cancelAll',function(args){
        console.log('cancelAll');
    });
    u.render();
    console.log(u.getType());
  });
</script>

````