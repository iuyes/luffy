# TextareaErrorFocus

---

TextareaErrorFocus 继承了 [Widget](http://docs.alif2e.com/arale/widget/)，可使用其属性和方法。

---

## 配置说明

### element `dom`

目标元素。
	
### errorRegx `regExp`
	
黑名单字符正则。

### highLightClassName `string`
	
高亮时候设置的ClassName，便于设置CSS selection样式。

## 方法
	
### validate `function`

开始校验错误。

- `errors` {array}

	错误集合。

- `errorCount` {number}

	错误总数。

### focusError `function`

查找并聚焦到下一个错误（根据当前输入焦点找到下一个）。

## 事件

### validate

校验结果事件。

返回参数对象如下：

- `errors` {array}

	所有校验错误集。

- `errorCount` {number}

	错误总数

### noError

无错误时候回调。

### focusError

聚焦错误时候回调。

返回参数对象如下：

- `errors` {array}

	所有校验错误集。

- `errorCount` {number}

	错误总数

- `errorIndex` {number}

	当前错误序号

- `firstErrorStartPos` {number}

	第一个错误字符开始位置。

- `firstErrorEndPos` {number}

	第一个错误字符结束位置。



## 实例方法

详见演示TAB

