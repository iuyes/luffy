<li class="ui-uploader-file-item clearfix" data-item-file-id="{{fileId}}" data-role="uploader-item">
	<div class="ui-uploader-file-name" data-role="uploader-filename">{{fileName}}</div>
	{{#if hasProgressbar}}
		<div data-progressbar-file-id="{{fileId}}" class="ui-progressbar ui-progressbar-process" data-role="progressbar">
			<div class="ui-progressbar-status" data-role="progressbar-status"></div>
			<span class="ui-progressbar-label" data-role="progressbar-label"></span>
		</div>
	{{else}}
		<div data-progressbar-file-id="{{fileId}}" class="ui-simple-progressbar" data-role="progressbar"><img src="http://img.alibaba.com/simg/single/icon/loading_16x16.gif" /></div>
	{{/if}}
	<div class="ui-uploader-file-action">
		<a href="javascript:void(0);" onclick="return false;" class="status-action-remove" data-button-remove-file-id="{{fileId}}" data-role="uploader-remove">{{removeText}}</a>
		<a href="javascript:void(0);" onclick="return false;" class="status-action-cancel" data-button-cancel-file-id="{{fileId}}" data-role="uploader-cancel">{{cancelText}}</a>
	</div>
</li>
