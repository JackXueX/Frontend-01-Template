# class1
### 一、精度问题以及判断+0 -0方法

####1.精度问题:

用二进制表示0.1 0.2是除不尽的，所以精度不准确

####2.判断+0 -0:

```
	function check(zero){
		if(1/zero === Infinity){
			return 1;
		}
		if(1/zero === -Infinity){
			return -1;
		}
	}
	// 取符号的时候可以用到
```

### 二、Grammer

#### 1.符号优先级：

* + -
* * /
* ()

#### 2.表达式：（类型转换）

* ***(1).Member(属性访问，以举例的方式说明，便于理解)***
 
	* a.b
		* Reference 

		```
		// Reference底层的实现
		class Reference {
			this.object = object;
			this.property = property;
		}

		// delete 赋值的时候体现出引用的特性
		// assign 
		```
	* a[b]
	* foo\`string\`

		```
		function foo() {
			console.log(arguments);
		}
		foo`Hello ${name}!`//调用必须这样写 ？1.为什么这么写：因为标准规定就是这种写法(将变量以值得形式传进去，写子语法)
		// 会将字符串跟变量放在一个数组中，分成两部分传进来
		```
	* super.b

		```
		class Parent {
			constructor(){
				this.a = 1;
			}
		}
		class Child extends Parent{
			constructor(){
				super();
				console.log(this.a);
			}
		}
		Parent.a = 1;
		// 1
		new Child
		// 1
		```

	* super['b']
	* new.target
		* 只能在函数里面用
		
		```
		function foo() {
			console.log(new.target);
		}
		new foo();
		// 调用结果 f foo() {console.log(new.target);}
		```
	* new Foo()
		* 带()的优先级最高
		* 举例：（仅仅是个例子）

		```
		function cls1(s){
			console.log(s);
		}
		function cls2(s){
			console.log("2",s);
			return cls1;
		}
		// 调用
		new new cls2("good");
		// 打印  2 good
		// cls1{}
		```

* ***(2).New***
	* new Foo

* ***(3).Call***
	* foo()
	* super()
	* foo()['b']
	* foo().b
	* foo()\`abc\`

	***javascript精华 member、new 、call优先级逐渐变低***

	```
		class foo{
			constructor(){
				this.b = 1;
			}
		}
        new foo()['b']
		//1 先new再取b
		new (foo()['b'])//报错
    ```

* ***(4).left right : 等号左边（要求是个Reference）和等号右边***

	```
	a.b = c;
	a + b = c;

	foo() = 1;
	foo()['a'] = 1;
	new foo = 2;
	//全都合法
	```

* ***(5).Update ECMA 178 11.9.1(a后面的++不能换行)***
	* a++
	* a--
	* --a
	* ++a

* ***(6).Unary(单目运算符)***
	* delete a.b
	* void foo()
		* 生成undefined的方法：void 0;

		```
			//void进行IFFE
			for(var i = 0; i < 10; i++){
				var button = document.createElement("button");
				document.body.appendChild(button);
				button.innerHTML = i;
				(function(i){
					button.onclick = function(){
						console.log(i);
					}
				})(i)
			}

			for(var i = 0; i < 10; i++){
				var button = document.createElement("button");
				document.body.appendChild(button);
				button.innerHTML = i;
				void function(i){
					button.onclick = function(){
						console.log(i);
					}
				}(i)
			}
			// 这种写法的好处就是忘记加;了，避免文件合并导致的异常
		```
	* typeof a

		* typeof null //"object"(设计不合理)
		* typeof function(){} //"function"
	* +a
	* ~a(按位取反)
	* !a
	* await a

* ***(7).Exponent***
	* \**

	```
	3 ** 2 ** 3
	3 ** (2 ** 3)
	```


* ***(8).Multiplicative***
	* * / %

* ***(9).Additive***
	* + -

* ***(10).Shift***
	* <<>>  >>>

* ***(11).Relationship***
	* <> <= >= instanceof in

* ***(12).Equality(最恶心，最复杂)***
	* ==
	* !=
	* ===
	* !==

* ***(13).Bitwise(位运算)***
	* & ^ |


* ***(14).Logical(有短路 当成 if 用)***
	* &&
	* ||


* ***(15).Conditional(表达式可以用三目 =>)***
	* ? :

	```
	i > 0 ? i > 11 ? 'a' : 'b' : 'c'
	```

#### 3.类型转换
|        | Number | String | Boolean | Undefined | Null | Object | Symbol | 
|  ----  | ----   | ----  | ----  | ----  | ---- | ---- | ----| ---- | ---- |
| Number   | - |  | 0 false | x | x | Boxing |  x |
| String |  | - | "" false | x | x | Boxing |  x |
| Boolean | true 1 false 0 | 'true' 'false' | - | x | x | Boxing |  x |
| Undefined | NaN |  'undefined' | false | - | x |  x | x |
| Null | 0 | 'null' | false | x | - | x |  x |
| Object | valueOf | valueOf toString | true | x | x | - |  x |
| Symbol | x | x | x | x | x | Boxing |  - |


***类型转换举例：(装箱、拆箱)***

```
/*
	装箱运算(只有4种)
**/
new Number(1);
new String('hello');
new Boolean(true);

Number(1);//有强制类型转换功能
String('hi');//有强制类型转换功能
Boolean(true);//有强制类型转换功能
//带new包装型的会变为一个对象(object) 不带new转换为普通类型  它们的typeof不一样
Object('1')

new Symbol('1'); x //不可以new
Symbol('1');
Object(Symbol(1));
(function(){return this}).apply(Symbol('x'));

/*
	拆箱运算
**/

1 + {}//默认字符串
1 + {valueOf(){return 2}}//3 typeof 'number'
1 + {toString(){return 2}}//3 typeof 'number'
1 + {toString(){return '4'}}//'14' typeof 'string'
1 + {valueOf(){return '4'}}//'14' typeof 'string'

1 + {valueOf(){return 2}, toString(){return '2'}}//3 typeof 'number' 用valueOf的值
'1' + {valueOf(){return 1}, toString(){return '2'}}//'11' typeof 'string' 用valueOf的值


1 + {[Symbol.toPrimitive](){return 6}, valueOf(){return 1}, toString(){return '2'}}
//7 typeof 'number' [Symbol.toPrimitive]优先级最高

1 + {[Symbol.toPrimitive](){return {}}, valueOf(){return 1}, toString(){return '2'}}
//报错

1 + {valueOf(){return {}}, toString(){return '2'}}
//'12' typeof 'string'
```



# class2

### 一、Runtime

####1.Completion Record:
* [[type]]:normal, break, continue, return, or throw

* [[value]]:Types

* [[target]]:label


####2.Lexical Environment：

### 二、Grammer

####1.简单语句:

* ExpressionStatement

	```
	a = 1 + 2;
	```
* EmptyStatement
	
	```
	;
	```
* DebuggerStatement

	```
	产生调试中断（不会产生任何效果）
	debugger;
	```
* ThrowStatement

	```
	throw a;
	```
* ContinueStatement

	```
	contimue label1;
	```
* BreakStatement
	
	```
	break label1;
	```
* ReturnStatement

	```
	return 1 + 2;
	```

####2.组合语句：
* BlockStatement

	* [[type]]:normal

	* [[value]]:--

	* [[target]]:--

	```
	{
		a: 1;
		throw 1;
		let b = 2;
		b = foo();
		// 如果有非normal则产生中断，不继续执行
	}
	```
* IfStatement
	
	```
	
	```
* SwitchStatement

	```
	
	```
* IterationStatement

	```
	while( xxx ) xxx // 会消费 continue break 

	do xxx while ( xxx );

	for( ***; xxx; xxx ) xxx // *** 表示可以放声明 var const/let 
	// for 本身会产生一个作用域，在block之外
	// var 不受块级作用域影响  依然变量提升

	for( *** in xxx ) xxx
	for(let p in {a:1, b:2}){
		console.log(p);// a b 循环key
	}

	for( *** of xxx ) xxx
	for(let p of [1, 2, 3]){
		console.log(p);
	}
	function *g(){
		yield 0;
		yield 1;
		yield 4;
	}
	for(let p of g()){
		console.log(p);
	}
	// 任何有迭代属性的结构都可以

	*** for await (of)
	```
* WithStatement

	```
	
	```
* LabelledStatement

	```
	// 很少使用
	```
* TryStatement

	```
	try {
		//不是block 但是会产生作用域
		throw 
	}catch( ***//这里没有新的作用域 ){
	
	}finally{
	
	}
	```
	
	***作用域：从语言的角度来描述，指的是有效的文本的范围***  
	***上下文：用户的电脑上，内存里面，存变量的地方***

####3.声明：

* FunctionDeclaration
	
	```
	foo(); // 声明提升 但是好于 var
	function foo(){}
	// 注意表达式版本
	```
* GeneratorDeclaration
	
	```
	function* foo(){
		yield 1;
		yield 2;
		
		var i = 3;
		while(true) {
			yield i++;
		}
	}
	// 和async没有任何关系，结构能模拟await而已
	// 标准用法就是让一个函数分步返回多个值
	// 注意表达式版本
	```
* AsyncFunctionDeclaration
	
	```
	function sleep(d){
		return new Promise(resolve => setTimeout(resolve, d));
	}
	void async function(){
		var i = 0;
		while(true) {
			console.log(i++);
			await sleep(1000);
		}
	}();
	```
* AsyncGeneratorDeclaration
	
	```
	function sleep(d){
		return new Promise(resolve => setTimeout(resolve, d));
	};

	async function* foo(){
		var i = 0;
		while(true) {
			yield i++;
			await sleep(1000);
		}
	};

	void async function (){
		var g = foo();
		//console.log(await g.next());
		//console.log(await g.next());
		//console.log(await g.next());
		//console.log(await g.next());
		for await (let e of g){
			console.log(e);
		}
	}()
	// 打印结果 {value: 1, done: false}
	// {value: 2, done: false}
	```
* VariableStatement
	
	```
	var x = 0;
	function foo(){
		var o = {x : 1};
		x = 2;
		with(o) {
			var x = 3;//var 不管加在哪，都是针对整个函数的作用域，设计缺陷
		}
		console.log(x);// 2
	}
	foo();
	console.log(x);// 0

	// 1.有 var 必须写在函数内最前面，至少在变量第一次出现的位置
	function foo(){
		var o = {x : 1};
		x = 2;
		if(false) {
			var x = 1; //var 改变了整个 x 的行为
		}
		console.log(x);// 3
		return 
		var x = 3;//var 改变了整个 x 的行为
	}
	// 2.不要在任何block语句里面用 var
	```
* ClassDeclaration
	
	```
	class o {}
	// 注意表达式版本

	var cls1 = 0;
	function foo() {
		cls1 = 2;
		class cls1 {

		}
	}
	foo() // x报错 声明之前不可以使用
	```
* LexicalDeclaration
* const
	
	```
	const 只能声明一次，并且要赋值
	```

### 三、Object

####1.Object释义：在计算机中表示万物

* 举例：三只一模一样的鱼，其实是三个对象
* 定义：  
***任何一个对象都是唯一的，与本身状态无关，即使状态一致也不相等***   
***用状态描述对象***  
***状态的改变就是行为***

* 几个误区：

	* 封装（架构不展示底层代码）、复用（粒度合适、抽象合理，复用性好）、解耦（不同模块关联性弱） --  描述的是架构方面的问题
  
	* 继承（面向对象的子系统）  

	* 多态（描述动态性的程度，跟图灵完备有点像，同一段代码，功能不一样）  


####2.Object-Class:
* 类是一种常见的描述对象的方式
* 归类 C++ （多继承 大类小类一层一层往下走）
* 分类 会有一个基类Object （一类一类分清楚）
	* 解决复用性：mixn

####3.js: Object-Prototype:
* 原型是一种更接近人类原始认知的描述对象的方法
* 不用严谨的分类，而是采用“相似”这种方式去描述对象
* 任何对象仅仅描述它自己与原型的区别即可

####3.js: Object in Javascript:
* 在JavaScript运行时，原生对象的描述方式非常简单，我们只需要关心原型和属性两个部分。

| Data Property | Accessor Property |
| ---- | ----|
| [[value]] | get |
| writable | set |
| enumerable | enumerable |
| configurable | configurable |

* JavaScript 用属性来统一抽象对象状态和行为
* 一般来说，数据属性用于描述状态，访问器属性则用于描述行为。
* 数据属性如果存储函数，也可以用于描述行为。

####4.原型链

####5.Object API/Grammer（面向对象系统）

* {} . [] Object.defineProperty --基本对象能力
* Object.create / Object.setPrototypeOf / Object.getPrototypeOf
* new / class / extends
* new / function / prototype（没有可取之处）

####6.Function Object

* 函数除了一般对象的属性和原型，函数对象还有一个行为[[call]]
* 用JavaScript中的function关键字、箭头运算符或者Function构造器创建的对象，会有[[call]]这个行为。

####6.Special Object（特殊行为对象）
* Array：Array的length属性根据最大的下标自动发生变化
* Object.prototype：作为所有正常对象的默认原型，不能再给它设置原型了
* String: 为了支持下标运算，String的正整数属性访问会去字符串里查找
* Arguments: arguments的非负整数型下标属性跟对应的变量联动
* 模块的namespace对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于import
* 类型数组和数组缓冲区：跟内春快相关联，下标运算比较特殊
* bind后的function:跟原来的函数相关联




















	