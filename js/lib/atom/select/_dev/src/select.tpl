<div class="ui-dropdown ui-dropdown-menu">
	<ul data-role="content">
	{{#each select}}
		<li data-role="item" class="{{#if disabled}}disabled{{/if}}" data-value="{{value}}" data-defaultSelected="{{output defaultSelected}}" data-selected="{{output selected}}" data-disabled="{{output disabled}}">{{{text}}}</li>
	{{/each}}
	</ul>
</div>