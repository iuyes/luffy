/**
 * 用HTML5的方式进行异步上传
 */
 
define(function(require, exports, module) {
    var Uploader = require('./uploader-base.js');
    var $ = require('$');

    /**
     * 封装一个文件对象,对外接口保持统一
     */
    var File = function(id, obj) {
            // id 和 orifile.id 为一致的目的是抹平和flash上传的差异.
            this.id = id;
            this.name = obj.name;
            this.orifile = obj;
            this.orifile.id = id;
        };

    var HTML5Uploader = Uploader.extend({
    		 attrs: {
            multiFile: false,
            // 0 表示无限制
            fileUploadLimit: 0
        },
        
        Statics: {
            /**
             * 覆盖父类的方法,监测是否支持HTML5上传
             */
            isSupport: function() {
                if(window.FileReader) {
                    return true;
                }
                return false;
            },
            getType: function() {
		            return Uploader.UPLOADER_TYPE_HTML5;
		        }
        },
        
        initialize: function(config) {
            this.cache = {
                // 缓存flash上传对象
                swfUploader: null,
                // 需要上传的文件的个数
                fileCountNeedToUpload: 0,
                // 已经上传的文件的个数
                fileCountUploaded: 0,
                // 缓存所有异步请求对象
                xhrArr: []
            };
            this._fileId = 0;
            this._idFileMap = {};
            this._idXHRMap = {};
            this._fileQueue = [];
            // 正在上传的文件Id
            this._uploadingFileId = 0;
            HTML5Uploader.superclass.initialize.call(this, config);
        },
       
        events: {
            "drop {{attrs.dragContainer}}": "_onFileDrop",
            "dragover {{attrs.dragContainer}}": "_onFileDragOver",
            "dragleave {{attrs.dragContainer}}": "_onFileDragLeave",
            "dragenter {{attrs.dragContainer}}": "_onFileDragEnter"
        },
        _onFileDrop: function(ev) {
            _self = this;
            _self.trigger(Uploader.availEvents.fileDrop);
            var files = ev.originalEvent.dataTransfer.files;
            for(var i = 0, len = ev.originalEvent.dataTransfer.files.length; i < len; i++) {
                var file = new File(++_self._fileId, ev.originalEvent.dataTransfer.files[i]);
                _self.trigger(Uploader.availEvents.fileSelect, {
                    file: file
                });
                _self._fileQueue.push(file);
            }
            _self._checkUploadFiles();
            ev.preventDefault();
            ev.stopPropagation();
        },
        _onFileDragOver: function(ev) {
            var _self = this;
            ev.preventDefault();
            ev.stopPropagation();
            _self.trigger(Uploader.availEvents.dragOver);
        },
        _onFileDragLeave: function(ev) {
            var _self = this;
            ev.preventDefault();
            ev.stopPropagation();
            _self.trigger(Uploader.availEvents.dragLeave);
        },
        _onFileDragEnter: function(ev) {
            var _self = this;
            ev.preventDefault();
            ev.stopPropagation();
            _self.trigger(Uploader.availEvents.dragEnter);
        },
        _onFileChange: function(ev) {
            var _self = this;
            var cache = _self.cache;
            var fileUploadLimit = _self.get('fileUploadLimit');
            if((fileUploadLimit > 0) && (fileUploadLimit < ev.currentTarget.files.length) ||
                (cache.fileCountUploaded + ev.currentTarget.files.length > fileUploadLimit)) {
                _self.trigger(Uploader.availEvents.error, {
                    file: null,
                    code: -240,
                    msg: 'ERROR_CODE_UPLOAD_LIMIT_EXCEEDED'
                });
            } else {
                for(var i = 0, len = ev.currentTarget.files.length; i < len; i++) {
                    var file = new File(++_self._fileId, ev.currentTarget.files[i]);
                    _self.trigger(Uploader.availEvents.fileSelect, {
                        file: file
                    });
                    _self._fileQueue.push(file);
                }
                _self._checkUploadFiles();
            }

            ev.preventDefault();
            ev.stopPropagation();
        },
        render: function() {          
            var buttonMask = this._renderButtonMask();
            var inputFileButton = $('<input type="file" data-rote="uploader-html5-input" autocomplete="off" name="file" />');
            
            buttonMask.append( inputFileButton );

            inputFileButton.css({
                width: '100%',
                height: '100%',
                cursor:'pointer',
                fontSize: '0'
            });
            
            if( this.get('multiFile') ) {
            	inputFileButton.attr('multiple', 'multiple');
            }

            this.delegateEvents('change input[data-rote=uploader-html5-input]', this._onFileChange);

            HTML5Uploader.superclass.render.call(this);
            this.trigger(Uploader.availEvents.ready);
            return this;
        },
       
        cancelAll: function() {
            var xhrArr = this.cache.xhrArr;
            for(var i = 0; i < xhrArr.length; i++) {
                xhrArr[i].abort();
            }
            this.trigger(Uploader.availEvents.cancelAll);
            if(this.cache.fileCountNeedToUpload !== 0) {
                this.cache.fileCountNeedToUpload = 0;
                this.trigger(Uploader.availEvents.completeAll);
                this._uploadingFileId = 0;
            }
        },
        remove:function(){
            var cache = this.cache;
            cache.fileCountUploaded--;
        },
        cancel: function(fileId) {
            var xhr = this._idXHRMap[fileId];
            if(xhr) {
                xhr.abort();
            }
            for(var i = this._fileQueue.length; i--;) {
                if(this._fileQueue[i].id === fileId) {
                    this._fileQueue.splice(i, 1);
                }
            }
            this.cache.fileCountNeedToUpload--;
            if(this.cache.fileCountNeedToUpload === 0) {
                this.trigger(Uploader.availEvents.completeAll);
            }

        },
        getUploadedCount: function(){
            return this.cache.fileCountUploaded;
        },
        addExistFile: function(){
            this.cache.fileCountUploaded++;
            this._fileId++;
        },
        /**
         * 检查文件类型是否符合
         */
        _checkFileType: function(fileName) {
            var result = true;
            var tempStr = '*' + fileName.substring(fileName.lastIndexOf('.'), fileName.length);
            tempStr = tempStr.toUpperCase();
            if(this.get('fileTypes').toUpperCase().indexOf(tempStr) != -1) {
                result = false;
            }
            return result;
        },
        /**
         * 删除xhr数组的指定对象
         */
        _removeFromXHRArr: function(xhr) {
            var _self = this;
            var xhrArr = _self.cache.xhrArr;
            for(var i = xhrArr.length; i--;) {
                if(xhr == xhrArr[i]) {
                    xhrArr.splice(i, 1);
                    break;
                }
            }
        },

        /**
         * 通过异步的方式上传文件
         * @param {file} file 需要上传的文件.
         * @this {AE.app.ansycUpload}
         */

        _uploadFileUseAjax: function(fileObj) {
            var file = fileObj.orifile;
            var xhr = new XMLHttpRequest();
            var cache = this.cache;
            var _self = this;

            this._idXHRMap[this._fileId] = xhr;
            this._idFileMap[this._fileId] = file;
            this._uploadingFileId = this._fileId;

            xhr.upload.addEventListener('progress', function(e) {
                if(e.lengthComputable) {
                    _self.trigger(Uploader.availEvents.progress, {
                        file: file,
                        loaded: e.loaded,
                        total: e.total
                    });
                }
            }, false);
            xhr.upload.addEventListener('load', function(e) {}, false);

            xhr.addEventListener('readystatechange', function(e) {
                try {
                    if(xhr.status === 200 && xhr.readyState === 4) {
                        var serverMsg = xhr.responseText;
                        cache.fileCountUploaded++;
                        cache.fileCountNeedToUpload--;
                        _self.trigger(Uploader.availEvents.complete, {
                            file: file,
                            serverMsg: serverMsg
                        });
                        if(cache.fileCountNeedToUpload === 0) {
                            _self.trigger(Uploader.availEvents.completeAll);
                            _self._uploadingFileId = 0;
                        }
                        _self._removeFromXHRArr(xhr);
                    }
                } catch(ex) {

                }
            }, false);

            _self.trigger(Uploader.availEvents.start, {
                file: fileObj
            });

            /* 手工生成POST请求
            //生成异步上传post请求信息,已经有新的利用FromData的解决方案,会替代手工生成http请求的方案
            // boundary写死为如下形式，Flash上传每次为不同值
            
            var boundary = '----------ei4GI3gL6gL6ae0ei4cH2Ef1gL6GI3';
            xhr.open('post', this.get('uploadURL'), true);
            cache.xhrArr.push(xhr);
            xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
            // simulate a file MIME POST request.
            boundary = '--' + boundary;
            var body = '';
            body += boundary + '\r\n';
            body += 'Content-Disposition: form-data; name="name"\r\n\r\n' + encodeURIComponent(file.name) + '\r\n' + boundary + '\r\n';
            for(var i in this.get('postParams')) {
                body += 'Content-Disposition: form-data; name="' + i + '"\r\n\r\n' + this.get('postParams')[i] + '\r\n' + boundary + '\r\n';
            }
            body += 'Content-Disposition: form-data;' + ' name="file"; filename="' + encodeURIComponent(file.name) + '"\r\n';
            body += 'Content-Type: application/octet-stream\r\n\r\n';

            if(file.getAsBinary) {
                //FF3.5 ~ FF7
                body += file.getAsBinary() + '\r\n';
                body += boundary + '\r\n';
                body += 'Content-Disposition: form-data; name="Upload"' + '\r\n\r\n';
                body += 'Submit Query' + '\r\n';
                body += boundary;
            } else {
                //Chrome
                var reader = new FileReader();
                //由于Chrome12的xmlhttprequest没有提供sendAsBinary方法，
                //如下简单的在chrome下面实现了FF的sendAsBinary方法
                reader.onload = function(file) {
                    try {
                        body += file.target.result + '\r\n';
                        body += boundary + '\r\n';
                        body += 'Content-Disposition: form-data; name="Upload"' + '\r\n\r\n';
                        body += 'Submit Query' + '\r\n';
                        body += boundary;

                        function byteValue(x) {
                            return x.charCodeAt(0) & 0xff;
                        }
                        if(xhr.sendAsBinary) {
                            xhr.sendAsBinary(body);
                        } else {
                            var ords = Array.prototype.map.call(body, byteValue);
                            var ui8a = new Uint8Array(ords);
                            xhr.send(ui8a.buffer);
                        }
                    } catch(ex) {

                    }
                };
                reader.readAsBinaryString(file);
            }

            if(file.getAsBinary) {
                //FF 3.5 ~ FF7
                xhr.sendAsBinary(body);
            }
            */
            // 使用FomrData发送请求
            xhr.open('post', this.get('uploadURL'), true);
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            var fd = new FormData();
            fd.append('name', file.name);
            // Add optional form data
            for(var i in this.get('postParams')) {
                fd.append(i, this.get('postParams')[i]);
            }
            // Add file data
            fd.append('file', file);
            // Send data
            xhr.send(fd);
        },

        // 检查上传文件的类型是否合法
        _checkUploadFiles: function() {
            var check = true;
            var _self = this;
            var cache = _self.cache;
            if(this.get('fileQueueLimit') !== 0 && _self._fileQueue.length > this.get('fileQueueLimit')) {
                //超出队列允许的最大文件数
                _self.trigger(Uploader.availEvents.error, {
                    file: files,
                    code: -100,
                    msg: 'ERROR_CODE_QUEUE_LIMIT_EXCEEDED'
                });
                check = false;
            }
            if(check) {
                cache.fileCountNeedToUpload += _self._fileQueue.length;
                while(_self._fileQueue.length !== 0) {
                    var fileObj = _self._fileQueue.shift();
                    var file = fileObj.orifile;
                    if(file.size / 1024 > parseFloat(_self.get('fileSizeLimit'))) {
                        //判断文件大小是否超标
                        _self.trigger(Uploader.availEvents.error, {
                            file: file,
                            code: -110,
                            msg: 'ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT'
                        });
                        cache.fileCountNeedToUpload--;
                    } else if(file.size === 0) {
                        _self.trigger(Uploader.availEvents.error, {
                            file: file,
                            code: -120,
                            msg: 'ERROR_CODE_ZERO_BYTE_FILE'
                        });
                        cache.fileCountNeedToUpload--;
                    } else if(_self._checkFileType(file.name) && this.get('fileTypes').indexOf('*.*') == -1) {
                        _self.trigger(Uploader.availEvents.error, {
                            file: file,
                            code: -130,
                            msg: 'ERROR_CODE_INVALID_FILETYPE'
                        });
                        cache.fileCountNeedToUpload--;
                    } else {
                        _self._uploadFileUseAjax(fileObj);
                    }
                }
            }

        }
    });

    module.exports = HTML5Uploader;
});
/* DUMMY2 */