# class1
### 结构化程序设计

* 宏任务
* 微任务
* 函数调用
* 语句/声明
* 直接量/变量/this...

####固有对象

	var set = new Set();
	var globalProperties = [
		"eval",
		"isFinite",
		"isNaN",
		"parseFloat",
		"parseInt",
		"decodeURI",
		"decodeURIComponent",
		"encodeURI",
		"encodeURIComponent",
		"Array",
		"Date",
		"RegExp",
		"Promise",
		"Proxy",
		"Map",
		"WeakMap",
		"Set",
		"WeakSet",
		"Function",
		"Boolean",
		"String",
		"Number",
		"Symbol",
		"Object",
		"Error",
		"EvalError",
		"RangeError",
		"ReferenceError",
		"SyntaxError",
		"TypeError",
		"URIError",
		"ArrayBuffer",
		"SharedArrayBuffer",
		"DataView",
		"Float32Array",
		"Float64Array",
		"Int8Array",
		"Int16Array",
		"Int32Array",
		"Uint8Array",
		"Uint16Array",
		"Uint32Array",
		"Uint8ClampedArray",
		"Atomics",
		"JSON",
		"Math",
		"Reflect"
	];
	var queue = [];
	for(var p of globalProperties){
		queue.push({
			path: [p],
			object: this[p]
		})
	}
	
	let current;
	
	while(queue.length){
		current = queue.shift();
		console.log(current.path.join('.'));
		if(set.has(current.object))
			continue;
		set.add(current.object);
		
		for(let p of Object.getOwnPropertyNames(current.object)){
			let property = Object.getOwnPropertyDescriptor(current.object, p)
			
			if(property.hasOwnProperty("value") && 
			(property.value != null && (typeof property.value == 'object') || (typeof property.value == 'object')) 
			&& property.value instanceof Object)
				queue.push({
					path: current.path.concat([p]),
					object: property.value
				})
			if(property.hasOwnProperty("get") && (typeof property.get == "function")){
				queue.push({
					path: current.path.concat([p]),
					object: property.get
				});
			}
			if(property.hasOwnProperty("set") && (typeof property.set == "function")){
				queue.push({
					path: current.path.concat([p]),
					object: property.set
				});
			}	
		}
	}
	
	console.log(set);


#### 函数调用

```
import {foo} from "foo.js"
var i = 0;
console.log(i);
foo();
console.log(i);
i++;
```

```
function foo(){
	var x = 1;
	console.log(x);
}
export foo;
```
* 思考：执行顺序？

```
var i = 0;
console.log(i);

	// 执行这两句的时候能不能访问到 i ? 
	// 能
	var x = 1;
	console.log(i);

console.log(i);
i++;
```
* 存在进入点  退出点  函数调用和函数返回
* 形成了执行上下文栈




# class2浏览器工作原理
### 浏览器

* URL  
	* HTTP
* HTML  
	* parse
* DOM  
	* css computing
* DOM with CSS  
	* layout
* DOM with position
	* render
* Bitmap

### ISO-OSI七层网络模型






























