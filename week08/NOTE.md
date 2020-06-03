# class1

### 一、选择器语法

#### 1.简单选择器

* *

* div svg|a

* \#id

* [attr=value]

	```
	a[title] {}

	a[href="https://example.com"] { }
	```

* :hover

	```
	//伪类：样式化一个元素的特定状态，:hover只会在鼠标指针悬浮到一个元素上的时候选择这个元素

	a:hover {}
	
	// 常见的伪类：:hover :link :active :target :not() :focus
	```

* ::before

	```
	//伪元素选择器
	::before{
		content: '',
		// 其他样式
	}

	// 常见的伪元素： 
	::first-letter  ::first-line  ::before  ::after  ::section  
	
	```

#### 2.复合选择器

* <简单选择器><简单选择器><简单选择器>

* *或者 div 必须写在前面

#### 3.复杂选择器

* <复合选择器> \<sp> <复合选择器>

* <复合选择器> ">" <复合选择器>

* <复合选择器> "~" <复合选择器>

* <复合选择器> "+" <复合选择器>

* <复合选择器> "||" <复合选择器>

### 二、选择器优先级

***选择器优先级规则：基于位置累加，以保证多个类选择符累加起来不会大于一个id选择符的特殊性***

***任何类选择符的特殊性都对应如下4个级别：a、b、c、d***

* 行内样式，a为1；
* b等于ID选择符的数目；
* c等于类选择符、伪类选择符及属性选择符的数目；
* d等于类型(type)选择符(元素选择器)和伪元素选择符的数目
* *选择符为不计入

```
style=""    (1,0,0,0)
#a #b {}    (0,2,0,0)
div#a.b .c[id=x]    (0,1,3,1)
#a:not(#b)    (0,2,1,0)
``` 


### 三、伪类

***链接/行为***

* :any-link
* :link:visited
* :hover
* :active
* :focus
* :target

***树结构***

* :empty
* :nth-child()
* :nth-last-child()
* first-child :last-child :only-child

***逻辑型***

* :not伪类
* :where:has



### 三、伪元素

***伪元素***

* ::before
* ::after
* ::firstLine
* ::firstletter

```
<div>
	<::before/>
	contentcontentcontentcontent
	contentcontentcontentcontent
	contentcontentcontentcontent
	contentcontentcontentcontent
	<::after/>
</div>


<div>
	<::first-letter>c</::first-letter>contentcontentcontentcontent
	contentcontentcontentcontent
	contentcontentcontentcontent
	contentcontentcontentcontent
</div>


<div>
	<::first-line>contentcontentcontentcontent</::first-line>
	contentcontentcontentcontent
	contentcontentcontentcontent
	contentcontentcontentcontent
</div>
```

***可用属性***
![518b7a14152bfceb5ad753117f98f43.png](https://upload-images.jianshu.io/upload_images/19689657-b7443c8828aa8e85.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


***思考：为什么 first-letter 可以设置float，而 first-line 不行呢***

```
first-line设置float会造成无限循环
```



# class2（排版）

### 一、盒（Box）

|  源代码   | 语义  | 表现 |
|  ----  | ----  | ---- |
| 标签  | 元素 | 盒 |
| Tag | Element | Box |

***排版和渲染的基本单位是盒***


### 二、盒模型

![44a9bab450cde333f5adfabaecaacc7.png](https://upload-images.jianshu.io/upload_images/19689657-ee4072e1d0cf94a6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 三、正常流排版

* 收集盒进行

* 计算盒在行中的排布

* 计算行的排布

![74d3b4b3f19f455e8872952024567d8.png](https://upload-images.jianshu.io/upload_images/19689657-43397779a8be4e2f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 四、正常流的行模型

![cf1490f8369497721c8b7385c1ce2cb.png](https://upload-images.jianshu.io/upload_images/19689657-275a35893d5cdfa0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


#### 当 ***display: inline-block*** 遇到 ***vertical-align***

* vertical-align只对行内元素有效（inline-block）
* 一般对于行内元素用 top middle bottom 
* 这些值使元素相对于其 ***父元素*** 垂直对齐


### 四、float与clear

***回归到 float的本质，遇到文字绕排就用一下，其他布局还是用 flex***


### 五、margin折叠、overflow:visible 与 BFC(块级格式化上下文)

* BFC元素特性表现原则就是，内部子元素再怎么翻江倒海，都不会影响外部元素。避免 maigin 穿透，清除浮动。

* 触发 BFC 的条件：
	* float的值不为none。
	* overflow的值为 auto, scroll 或 hidden。
	* display的值为table-cell, table-caption, inline-block中的任何一个。
	* position的值不为relative和static。

***正常流里面的容器并且overflow:visible，则不产生BFC,会跟父元素合并***





































 