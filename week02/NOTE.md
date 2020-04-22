## class1 编程语言通识

### 一、语言按语法分类

* 非形式语言
	* 中文，英文
* 形式语言（乔姆斯基谱系）  
	* 0型 无限制文法
	* 1型 上下文相关文法（一个词跟得意思跟上下文有关）
	* 2型 上下文无关文法（一个词就是一个意思，与位置无关，大多数编程语言）
	* 3型 正则文法（能用正则表达式解析，对表达能力限制强）
 
	**注：现代编程语言会将所有的语法分为文法和词法两个部分**
#### 产生式—BNF（巴科斯范式，用到了递归）
	* 用尖括号括起来的名称来表示语法结构名
	* 语法结构分成基础结构和需要用其他语法结构定义的复合结构
 		* 基础结构称终结符（例3\<Number> + - * /）
		* 复合结构称非终结符（例3\<MultiplicativeExpression>和\<AddtiveExpression>）
	* 引号和中间的字符表示终结符
	* 可以有括号
	* * 表示重复多次
	* | 表示或
 	* + 表示至少一次  

	##### 举例  
	###### 例1
	```				
	<Program> ::= "a" | "b"+
	<Program> ::= <Program>"a"+ |<Program> "b" 	+
	```	
	###### 例2(定义一个加法)
	```
	<Number> ::= "0" | "1" | "2" |......| "9" //定义数
	<DecimaNumber> ::= "0" | (("1" | "2" |......| "9") <Number>* ) //定义一个十进制整数
	//<Expression> ::= <DecimaNumber> "+" <DecimaNumber>
	//<Expression> ::= <Expression> "+" <DecimaNumber> //做递归
	//<Expression> ::= <DecimaNumber> //表示写一个也行  比如1
	<Expression> ::= <DecimaNumber> | <Expression> "+" <DecimaNumber>
	``` 
	###### 例3(定义一个带括号优先级的四则运算)
	```
	<Number> ::= "0" | "1" | "2" |......| "9"

	<DecimaNumber> ::= "0" | (("1" | "2" |......| "9") <Number>* )

	<PrimaryExpression> ::= <DecimaNumber> | 
		"(" <LogicalExpression> ")"

	<MultiplicativeExpression> ::= <PrimaryExpression> | 
		<MultiplicativeExpression> "*" <PrimaryExpression> |
		<MultiplicativeExpression> "/" <PrimaryExpression>

	<AddtiveExpression> ::= <MultiplicativeExpression> | 
		<AddtiveExpression> "+" <MultiplicativeExpression> |
		<AddtiveExpression> "-" <MultiplicativeExpression>

	<LogicalExpression> ::= <AddtiveExpression> |
		<LogicalExpression> "||" <AddtiveExpression> |
		<LogicalExpression> "&&" <AddtiveExpression>
	```
	> 总结：只要是形式化的语言都可以用BNF去描述，其实就是定义了语言的一种解析形式，体会如何去描述一种语言，让机器能读懂

	
##### 通过产生式理解乔姆斯基谱系:

* 0型 无限制文法  

	* ?::= ?	(\<a>\<b> = "c")

* 1型 上下文相关文法

	* ?\<A>?::= ?\<B>?		("a"\<b>"c" = "a" "x" "c" :在a和c的条件下x被解析为b)

* 2型 上下文无关文法

	* \<A>::= ? (等号左边只有一个终结符，A的结构是一定的，必须要有这么多东西才能解析为A)

* 3型 正则文法

	* \<A>::= \<A>? (通过正则解析)
	* \<A>::= ?\<A> //错误
 

### 二、图灵完备性

* 图灵完备性

	* 命令式 - 图灵机
		* goto 
		* if和while （分支和循环）
	
	* 声明式 - lambda
		* 递归 （有递归就要考虑图灵完备性）

### 三、动态与静态
* 动态：
	* 在用户设备/在线服务器上
	* 产品实际运行时
	* Runtime
* 静态：
	* 在程序员设备上
	* 产品开发时
	* Compiletime 

###四、 类型系统
* 按照动静划分：动态类型系统与静态类型系统
* 按照是否隐式转换划分：强类型与弱类型（弱类型的意思有隐式转换）
	* String + Number
	* String == Boolean
* 复合类型
	* 结构体
	* 函数签名
* 子类型
	* 逆变/斜变（加入继承后）

### 五、一般的命令式语言（五层结构）

* Atom（原子：变量名 3.2 "字符串"）
	* Indentifier （标识符）
	* Literal	（直接量）
* Expression（表达式）
	* Atom
	* Operator（操作符）
	* Punctuator （操作符 + - * / ; ''）
* Statement （语句 递归）
	* Expression
	* Keyword
	* Punctuator
* Structure （结构化程序设计）
	* Function（产生域的概念）
	* Class
	* Process
	* Namespace
	* ......
* Program（程序级）
	* Program（js）
	* Module（js）
	* Package
	* Library

***

## class2 Javascript

### 一、ASCII、Unicode、UTF-8
	
> ***ASCII***  上世纪60年代，美国制定了一套字符编码，对英语字符和二进制之间的关系做了统一规定，被称为ASCII码。ASCII一共规定了128个字符编码。
>>二进制：在计算机内部，所有的信息最终都是一个二进制值。每一个二进制值（bit）有0或1两种状态，八个二进制位可以组合成256种状态，被称为一个字节（byte）。也就是说，一个字节可以有256种状态，从 00000000 到 11111111。

> ***UNICODE***  是一个比ASCII更大的编码集，它规定的是符号的二进制代码，可以容纳100多万个符号，将世界上所有的符号都纳入其中。

> ***UTF-8*** 是在互联网上使用最广的一种 Unicode 的实现方式。UTF-8 最大的一个特点，就是它是一种变长的编码方式。它可以使用1~4个字节表示一个符号，根据不同的符号而变化字节长度。

[以上参考自阮一峰老师的博客：http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)

***关于Unicode的两个网站:***  
[1.官网：https://home.unicode.org/](https://home.unicode.org/)  
[2.老师推荐：https://www.fileformat.info/info/unicode/](https://www.fileformat.info/info/unicode/)

***UNICODE比较重要的几个：***  	
	U+000A	  LINE FEED (LF) (U+000A)  
	U+0020	SPACE (U+0020)  
	CJK Unified Ideographs	U+4E00	U+9FFF	(20989)（中文）

### 二、进制（补充知识）
> ***二进制：*** Binary (0、1)逢2进1，二进制是计算机唯一使用的进制  
> ***八进制：*** Octal (0、1、2、3、4、5、6、7) 逢8进1，主要作用就是将数值的识别和表达简单化  
> ***十进制：*** Decimal (0、1、2、3、4、5、6、7、8、9) 逢10进1，十进制是我们生活中使用得最频繁的进制  
> ***十六进制：*** Hexadecimal (0、1、2、3、4、5、6、7、8、9、A[表示10]、B[表示11]、C[表示12]、D[表示13]、E[表示14]、F[表示15]) 逢16进1，主要作用就是将数值的识别和表达简单化

[参考阅读：二、八、十、十六进制转换（图解篇）：https://www.cnblogs.com/gaizai/p/4233780.html](https://www.cnblogs.com/gaizai/p/4233780.html)
### 三、InputElement
##### 1.WhiteSpace(空格) :: 
> ***\<TAB>*** -U+0009	 CHARACTER TABULATION  (U+0009) 
>>按tab键产生的空白，早期的主要作用是调整表单格式，在编码中用来缩进

>***\<VT>*** U+0011	DEVICE CONTROL ONE (U+0011)
>>纵向制表符

>***\<FF>*** U+000C	FORM FEED (FF) (U+000C)

>***\<SP>*** U+0020	SPACE
>>普通空格

>***\<NBSP>*** U+00A0	NO-BREAK SPACE
>> 换行可能会导致两个词断开，如Java script，不想让两个词之间断开，则在两个词之间插入&nbsp => Java&nbsp;script

>***\<ZWNBSP>*** 
>> Zero width no break space 零宽空格

>***\<USP>*** 
>> Unicode空格
 
##### 2.LineTerminator (换行符) ::  

>***\<LF>*** U+000A LINE FEED (LF)
>> '\n',一般用这个

>***\<CR>*** U+000D CARRIAGE RETURN (CR)

>***\<LS>*** U+2028 LINE SEPARATOR
>> 勿用：超出Unicode编码

>***\<PS>*** U+2029 PARAGRAPH SEPARATOR
>> 勿用：超出Unicode编码

##### 3.Comment (注释) ::  

> /***/ //

##### 4.Token (js中一切有实际意义的) ::  

>***Punctuator*** 
>> 符号，形成结构

>***IdentifierName***   
>> 1.标志符 var a  
>> 2.变量名不可以跟关键重合  
>> 3.属性名可以跟关键字重合

>> ***Keywords***  
>> ***Identifier***  
>> ***Futrue reserved Keywords*** 将来要用的关键字，只剩enum了

>***Literal***直接量
>> ***Number***  
>>>***DecimalLiteral***  
>>>> 表示方法： ***0***  ***0.*** ***.2***  ***1e3***

>>>***BinaryIntegerLiteral***
>>>>表示方法： ***0b111***

>>>***OctalIntegerLiteral***
>>>>表示方法： ***0o10***

>>>***HexIntegerLiteral***
>>>>表示方法： ***0xFF***


>>>***Safe Integer***
>>>>表示方法： ***Number.MAX_SAFE_INTEGER.toString(16)***

>>>***Float Compare***
>>>>表示方法： ***Math.abs
(0.1 + 0.2 0.3) <= Number.EPSILON***


>>>***HexIntegerLiteral***
>>>>表示方法： ***0xFF***

>> ***String***  
>>>***Character***  
>>>***Code Point***  
>>>***Encoding*** 
>>>>举例： ***a***  ***97***  ***01100001***  

>>>***ASCII***


>> ***Boolean***  
>> ***Undefined***  
>> ***Null***  
>> ***Symbol***  
>> ***Object***  







































