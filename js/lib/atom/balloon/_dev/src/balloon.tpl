<div class="ui-balloon">
	{{#if complex}}
		<div class="ui-notice ui-notice-normal dependency">
			<div class="ui-notice-content">
				{{#if hasCloseX}}
				<a href="javascript:;" class="ui-close" data-role="close">close</a>
				{{/if}}
				<h4 class="ui-notice-header" data-role="title"></h4>
				<div class="ui-notice-body" data-role="content"></div>
			</div>
		</div>
	{{else}}
		<div data-role="content"></div>
	{{/if}}
	
	<a class="ui-balloon-arrow" data-role="arrow"></a>
</div>