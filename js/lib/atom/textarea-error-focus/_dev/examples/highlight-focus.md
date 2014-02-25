# Highlight-focus

-order:2

---


<style>
textarea { width:300px; height:100px; padding:10px; line-height:120%; }
</style>

````css
/* custom style for selection */
.high-light-focus::selection { background:red; color:#ffffff; }
.high-light-focus::-moz-selection { background:red; color:#ffffff; } 
.high-light-focus::-webkit-selection { background:red; color:#ffffff; }
````

````html
<textarea id="demo-textarea-1">
Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team! Hello Alibaba F2E Team!!!!
</textarea>
````

````js
seajs.use(['$','js/6v/lib/icbu/highlight-focus/highlight-focus'], function($,highlightFocus){
	highlightFocus({
		element : document.getElementById('demo-textarea-1'),
		start : 326,
		end : 334
	});
});
````