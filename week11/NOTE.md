# 手摸手，带你探究异步编程

### 从一个红绿灯问题来学习异步编程

#### 问题描述：一个路口的红绿灯，会按照你绿灯亮10秒，黄灯亮2秒，红灯亮5秒的顺序无限循环，请编写JS代码来控制这个红绿灯

> 话不多说，首先我们肯定要实现红绿灯的展示，这部分比较基础，直接上代码

```
// CSS部分
div {
	background-color: gray;
	display: inline-block;
	margin: 30px;
	height: 100px;
	width: 100px;
	border-radius: 50%;
}
.green.light {
	background-color: green;
}
.yellow.light {
	background-color: yellow;
}
.red.light {
	background-color: red;
}

// HTML部分
<div class="green"></div>
<div class="yellow"></div>
<div class="red"></div>

// JS部分
function green() {
	let lights = document.getElementsByTagName("div");
	for (let i = 0; i < 3; i++) {
		lights[i].classList.remove("light");
	document.getElementsByClassName("green")[0].classList.add("light");
	}
}

function yellow() {
	let lights = document.getElementsByTagName("div");
	for (let i = 0; i < 3; i++) {
		lights[i].classList.remove("light");
		document.getElementsByClassName("yellow")[0].classList.add("light");
	}
}

function red() {
	let lights = document.getElementsByTagName("div");
	for (let i = 0; i < 3; i++) {
		lights[i].classList.remove("light");
		document.getElementsByClassName("red")[0].classList.add("light");
	}
}

```

> 接下来，我们先思考一下如何每隔一段时间去点亮一个灯，并且让其他灯变灰。最简单的办法就是用setTimeout()去实现

```
function go() {
	green();
	setTimeout(() => {
		yellow();
		setTimeout(() => {
			red();
			setTimeout(() => {
				go()
			}, 5000)
		}, 2000);
	}, 10000);
}

go();
```
> 刚开始我用的是setInterval()去实现循环的，但是它有一个最大的弊端就是需要写间隔的总时间，相对而言，并没有递归来得简洁优雅。  
> 这里我们也可以看到，用setTimeout去实现的话就是无脑嵌套，但是需要循环的元素很多的话，就会陷入“回调地狱”，“地狱模式啊，筒子们！”  
> 为了帮助大家摆脱“地狱”，回到“人间”，ES6将promise写入了规范，promise最大的优势就是采用链式调用，解决了回调地域问题。

```
function sleep(t) {
     return new Promise((resolve, reject) => {
        setTimeout(resolve, t);
     })
}

function go() {
     green();
     sleep(10000).then(() => {
       yellow();
       return sleep(2000);
     }).then(() => {
       red();
       return sleep(5000);
     }).then(go).catch(err => {
		console.log('出错啦！')
	 });
}

go();
```

> 函数会根据上一个promise返回的执行结果(resolve,或者reject),来决定继续执行then里面的代码还是执行catch里面的代码。  
> promise相对于setTimeout来说，明显的避免了“回调地狱”问题，但是
也有弊端，最直白的就是有很多then，使代码非常冗余，不够简洁和语义化。
> 那么怎么干掉then,将异步代码伪装的像同步代码呢？前辈们采用generator函数去解决这个问题。

```
function sleep(t) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, t);
    });
}

function* go() {
	while(true) {
		green();
        yield sleep(10000);
        yellow();
        yield sleep(2000);
        red();
        yield sleep(5000);
     }
}
```
> 但是generator的调用就需要借助co框架去实现了，下面是co框架的实现思路

```
function run(iterator) {
      let {value, done} = iterator.next();
      if (done) {
          return;
      }

      if (value instanceof Promise) {
        value.then(() => {
          run(iterator);
        })
      }
}
function co(generator) {
      return function() {
        return run(generator());
      }
}

go = co(go);
		
go();
```
> 我们可以看到使用generator函数确实更加语义化了，但是需要引进co框架，你可能会想：“就一个红绿灯问题我还得引进一个co框架，内啥，我40米的大刀呢？”  
> ES2017 标准引入了 async 函数，使得异步操作变得更加方便。async 函数是什么？一句话，它就是 Generator 函数的语法糖。
> 接下来我们用async函数来实现红绿灯问题

```
function sleep(t) {
     return new Promise((resolve, reject) => {
        setTimeout(resolve, t);
     })
}

async function go() {
	while(true) {
		green();
    	await sleep(10000);
    	yellow();
    	await sleep(2000);
    	red();
    	await sleep(5000);
    }
}
go();

```
> 看到这里，你是不是有一种“删繁就简”爽快感。没有了被“回调地狱”支配的恐惧，也没有了then的冗余，异步代码以同步的方式优雅的呈现了出来。  
> 如果大家发现本文的代码错误或疏漏之处，欢迎大家指正。



























