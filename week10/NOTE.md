# class 1 DOM API

### 1.逆序元素

### 2.Range Api

* var range = new Range()

* range.setStart(element, 9)

* range.setEnd(element, 4)

* var range = document.getSelection().getRangeAt(0);

***快捷API***

* range.setStartBefore

* range.setEndBefore

* range.setStartAfter

* range.setEndAfter

* range.selectNode

* range.selectNodeContents

***最主要的功能***

* var fragment = range.extractContents()

* range.insertNode(document.createTextNode("aaa))

```
	// 逆序元素 1 2 3 4 =>  4 3 2 1 比较耗性能的时候就可以用
    let element = document.getElementById("a");
    function reverseChildren(element) {
      let range = new Range();
      range.selectNodeContents(element); // 选中element所有子元素

      let fragment = range.extractContents(); // 摘下来所有子元素
      var l = fragment.childNodes.length; // 不会重排重绘
      while(l-- > 0) {
        fragment.appendChild(fragment.childNodes[l]);
      }
      element.appendChild(fragment);
    }

    reverseChildren(element);
```

### 3.CSSOM

* document.styleSheets

```
	// 必须创建style标签才有styleSheet
	<style title="Hello">
		a {
			color: red;
		}
	</style>
	<link rel="stylesheet" title="x" href="data:text/css,p%7Bcolor:blue%7D"/>
```

***Rules***

* document.styleSheets[0].cssRules

* document.styleSheets[0].insertRule("p {color:pink;}", 0)

* document.styleSheets[0].removeRule(0)

* CSSStyleRule

	* selectorText String
	
	* style K-V结构

* CSSCharsetRule

* ...


### 4.getComputedStyle

* window.3.getComputedStyle(elt, pseudoElt)

* pseudoElt可选，伪元素


### 5.CSSOM View (视图)

##### 1.窗口api

```
let childWindow = window.open("about:blank", "_blank", "width=100,height=100,left=100,top=100");

childWindow.moveBy(-50, -50); // 向右下移动

childWindow.resizeBy(50, 50); // 长宽增加50
```


##### 2.视口滚动api

```
window.scrollX

window.scrollY

window.scroll(0, 30)

window.scrollBy(0, 50)
```

* 元素滚动api

```
$0.scrollTo(0, 100)

$0.scrollTop

$0.scrollLeft

$0.scrollHeight

$0.getClientRects() // 元素在端上占据的位置 最准确

$0.getBoundingClientRect() // 实际渲染的区域
```

##### 3.其他

```
window.innerHeight // ****重要

window.innerWidth // ****重要

window.outerHeight

window.outerWidth

window.devicePixelRatio // ****重要
```

### 所有API
```
let names = Object.getOwnPropertyNames(window);
```



















