# repeatable

// description
是一个工具组件，用来拷贝指定的 DOM 或模板到指定的容器中。

---

是一个工具组件，用来拷贝指定的 DOM 或模板到指定的容器中。

##配置说明

### element *String|element*

放置列表元素的父容器

### data *Array*

已有的元素列表数据，此属性在编辑状态下常用

### cloneTemplate *String|element*

被克隆的handlebars模板

###  itemSelector *String*

获取元素列表的选择符，用来统计列表数量及把元素插入到正确的位置，默认值为[data-role="repeatable-item"]

### events:{ 'click [data-role="repeatable-remove"]': '_onClickRemove' }

触发移除当前元素的配置, 默认为触发组件内置的_onClickRemove方法。当删除动作需要变更时可以此处做配置，如需异步发送数据后再删除元素。

### min *Number*

被克隆的最小次数，可选

### max *Number*
被克隆的最大次数，可选


## 属性
### length *Number*

获取列表的元素数量，只读

##方法
### clone(model) *[model=String|element]*
克隆指定的DOM结构或HTML模板，插入到指定的容器中。 使用方法 Repeatable.clone(element|template[, container][, ])

### remove(itemNode) *itemNode=String|element*
移除一个指定的列元素。

### removeItemByChild(childNode) *childNode=String|element*
根据指定列表中元素的一个子级元素来移除列表中的这个列元素

## 事件
本组件继承自Widget类，支持组件事件的约定规则，即支持before+方法名，after+方法名，change+属性名

### clone *length, cloneNode, model*
克隆元素并添加到DOM节点中触发， clone事件抛出三个参数： length，元素列表数量; cloneNode, 当前克隆的元素节点; model,当前克隆使用的数据

### changeLength * *
当元素列表数量变更时触发

### beforeRemove
当移除列元素前触发, .on('beforeRemove',function( $item ){});

### afterRemove
当移除列元素后触发, .on('afterRemove',function( $item ){});