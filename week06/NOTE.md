# class1

### 有限状态机处理字符串

* 每一个状态机都是一个机器
	* 在每一个机器里面，我们可以做计算、存储、输出
	* 所有得这些机器接受得输入是一致的
	* 状态机的每一机器本身没有状态，如果我们用函数来表示的话，它应该是纯函数（无副作用）

* 每一个机器知道下一个状态
	* 每个机器都有确定的下一个状态 (Moore)
	* 每个机器根据输入决定下一个状态 (Mealy)

### 使用有限状态机处理字符串

* 在一个字符串中，找到字符 "a"

```
function match(string) {
	for (let char of string) {
		if(char === 'a'){
			return true;
		}
	}
	return false;
}
		
console.log(match('adgfst'))
```

* 在一个字符串中，找到字符 "ab"

```
function match(string) {
	let FoundA = false;
	for (let char of string) {
		if (char === 'a') {
			FoundA = true;
		} else if (FoundA && char === 'b'){
			return true;
		} else {
			FoundA = false;
		}
	}

	return false;
}
		
console.log(match('assssb'));
```

* 在一个字符串中，找到字符 "abcdef"

```
function match(string) {
	let FoundA = false;
	for (let char of string) {
		if (char === 'a') {
			FoundA = true;
		} else if (FoundA && char === 'b'){
			return true;
		} else {
			FoundA = false;
		}
	}

	return false;
}
		
console.log(match('assssb'));
```


* 如何用状态机处理诸如 'abcabx' 这样的字符串

```
function match(string) {
	let state = start;
	for(let c of string) {
		console.log(c);
		state = state(c);
	}
	return state === end;
}

function start(c) {
	if (c === 'a') {
		return foundA;
	} else {
		return start;
	}
}

function end(c) {
	return end;
}

function foundA(c) {
	if (c === 'b') {
		return foundB;
	} else {
		return start(c);
	}
}

function foundB(c) {
	if (c === 'c') {
		return foundC;
	} else {
		return start(c);
	}
}

function foundC(c) {
	if (c === 'a') {
		return foundA2;
	} else {
		return start(c);
	}
}

function foundA2(c) {
	if(c === 'b'){
		return foundB2;
	}else{
		return start;
	}
}
		
function foundB2(c){
	if(c === 'x'){
		return end;
	} else if (c === 'c') {
		return foundC;
	} else {
		return start;
	}
}

console.log(match('abcabcabx'));
```