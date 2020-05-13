# week04
### 一、宏任务和微任务

####1.js代码执行过程:

宿主传递给javascript引擎一段代码，让它去执行。有时候宿主环境会给javaScript引擎提供API,让它在特定的时机去执行js代码。

ES5之后，javaScript引入了Promise，不需要浏览器的安排，javaScript引擎可以直接发起任务。

因此，宿主发起的任务被称为宏任务，javaScript发起的任务称为微任务。

####2.宏任务和微任务

宿主分配给javaScript引擎一个宏任务，一个宏任务里面又包含微任务队列。

例如：Promise永远在队列尾部添加微任务。setTimeout等宿主API则会添加宏任务。

####3.Promise

* (1).Promise 是 JavaScript 语言提供的一种标准化的异步管理方式，它的总体思想是，需要进行 io、等待或者其它异步操作的函数，不返回真实结果，而返回一个“承诺”，函数的调用方可以在合适的时机，选择等待这个承诺兑现（通过 Promise 的 then 方法的回调）。
* (2).通过一系列的实验，我们可以总结一下如何分析异步执行的顺序：
	* 首先我们分析有多少个宏任务；
	* 在每个宏任务中，分析有多少个微任务；
	* 根据调用次序，确定宏任务中的微任务执行次序；
	* 根据宏任务的触发规则和调用次序，确定宏任务的执行次序；
	* 确定整个顺序。  

####4.宏任务、微任务示例：

```
async function afoo(){
    console.log("-2")


    await new Promise(resolve => resolve());
    console.log("-1")
}


new Promise(resolve => (console.log("0"), resolve()))
    .then(()=>(
        console.log("1"), 
        new Promise(resolve => resolve())
            .then(() => console.log("1.5")) ));


setTimeout(function(){
    console.log("2");
    
    new Promise(resolve => resolve()) .then(console.log("3"))


}, 0)
console.log("4");
console.log("5");
afoo()

```

* 宏任务
	* 0， 4，5，-2
		* 入队 1， -1
	* 1
		* 入队 1.5
	* -1
	* -1.5
* 宏任务
	* 2
	* 3
















