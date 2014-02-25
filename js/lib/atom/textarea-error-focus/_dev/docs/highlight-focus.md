# Highlight-focus

-order:2
	

---

以下是Highlight-focus的说明文档。


## 方法

### highlightFocus(config)

- `element` {dom}

	目标元素。
	
- `start` {number} @default : 0
	
	选取起始字符位置。

- `end` {number} @default : 0
	
	选取结束字符位置。

- `highLightClassName` {string} @default : 'high-light-focus'
	
	高亮时候设置的ClassName，便于设置CSS selection样式。


## 最佳实践

### CSS

```css
/* custom style for selection */
.high-light-focus::selection { background:red; color:#ffffff; }
.high-light-focus::-moz-selection { background:red; color:#ffffff; } 
.high-light-focus::-webkit-selection { background:red; color:#ffffff; }
```

### JS
```js
seajs.use(['$','js/6v/lib/icbu/highlight-focus/highlight-focus'], function($,highlightFocus){
	highlightFocus({
		element : document.getElementById('demo-textarea'),
		start : 11,
		end : 29
	});
});
```