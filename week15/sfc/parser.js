const EOF= Symbol("EOF")//EOF: an end-of-file token.每个state都有个eof。

let currentToken = null
let stack = [{type:'document',children:[]} ]
let currentTextNode = null
function data(c){//start state
    if(c == "<"){
        return tagOpen
    }else if(c === EOF){
        emit({
            type:"EOF"
        }) 
    }else{
        emit({
            type:"text",
            content:c
        })
        return data
    }
}

function tagOpen(c){
    if(c == "/"){
        return endTagOpen
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type:"startTag",
            tagName:""
        }
        return tagName(c)
    }else if(c == EOF){
        emit({
            type:'text',
            content:'\u003c'
        })
        emit({
            type:'EOF'
        })
    }
    else{
        emit({
            type:'text',
            content:'\u003c'
        }) 
        return data(c)
    }
}

function tagName(c){
    if(c.match(/^[\t|\n|\f ]$/)){
        return beforAttributeName
    }else if(c == "/"){
        return selfClosingStartTag
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken.tagName+=c.toLowerCase();
        return tagName
    }else if(c == ">"){
        emit(currentToken) 
        return data
    }else if(c == EOF){
        emit({
            type:"EOF"
        }) 
    }
    else{
        currentToken.tagName+=c
        return tagName
    }
}

function beforAttributeName(c){
    if(c.match(/^[\t|\n|\f ]$/)){
    }else if(c == "/"){
        return afterAttributeName(c)
    }else if(c == ">"){
        return afterAttributeName(c)
    }else if(c == EOF){
        return afterAttributeName(c)
    }else if(c == "="){
        currentToken.attr = {
            attrName:c,
            attrValue:''
        }
        return attributeName
    }
    else{
        currentToken.attr = {
            attrName:'',
            attrValue:''
        }
        return attributeName(c)
    }
}
function attributeName(c){
    if(c.match(/^[>|/|\t|\n|\f ]$/)){
        return afterAttributeName(c)
    }else if(c == EOF){
        return afterAttributeName(c)
    }else if(c == "="){
        return beforAttributeValue
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken.attr.attrName+=c.toLowerCase();
        return attributeName
    }else{
        currentToken.attr.attrName+=c.toLowerCase();
        return attributeName
    }
}
function afterAttributeName(c){
    if(c.match(/^[\t|\n|\f ]$/)){
        return afterAttributeName
    }else if(c == ">"){
        emit(currentToken)
        return data
    }else if(c == "="){
        return beforAttributeValue
    }
    else if(c == "/"){
        return selfClosingStartTag
    }else if(c == EOF){
        emit({
            type:'EOF'
        })
    }else{
        currentToken.attr = {
            attrName:c,
            attrValue:''
        }
        return attributeName(c)
    }
}

function beforAttributeValue(c){
    if(c.match(/^[\t|\n|\f ]$/)){
    }else if(c == "\""){
        return doubleQuotedAttributeValue
    }else if(c == "\'"){
        return singleQuotedAttributeValue
    }else if(c == ">"){
        emit(currentToken)
        return data
    }
    else{
        return unQuotedAttributeValue(c)
    }
}
function doubleQuotedAttributeValue(c){
    if(c == "\""){
        return afterQuotedAttributeValue
    }else if(c == EOF){
        return emit({
            type:'EOF'
        })
    }else{
        currentToken.attr.attrValue += c
        return doubleQuotedAttributeValue
    }
}
function singleQuotedAttributeValue(c){
    if(c = "\'"){
        return afterQuotedAttributeValue
    }else if(c == EOF){
        return emit({
            type:'EOF'
        })
    }else{
        currentToken.attr.attrValue += c
        return singleQuotedAttributeValue
    }
}
function unQuotedAttributeValue(c){
    if(c.match(/^[\t|\n|\f ]$/)){
        return beforAttributeName
    }else if(c == ">"){
        emit(currentToken)
        return data
    }else if(c == EOF){
        return emit({
            type:'EOF'
        })
    }else{
        currentToken.attr.attrValue += c
        return unQuotedAttributeValue
    }
}
function afterQuotedAttributeValue(c){
    if(c.match(/^[\t|\n|\f ]$/)){
        return beforAttributeName
    }else if(c == ">"){
        emit(currentToken)
        return data
    }else if(c == "/"){
        return selfClosingStartTag
    }else if(c == EOF){
        return emit({
            type:'EOF'
        })
    }else{
        return beforAttributeName(c)
    }
}

function selfClosingStartTag(c){
    if(c == ">"){
        currentToken.isSelfclosing = true
        emit(currentToken)
        return data
    }else if(c == EOF){
        emit({
            type:"EOF"
        })
    }
    else{
        return beforAttributeName(c)
    }
}

function endTagOpen(c){
    if(c == ">"){
        return data
    }else if(c.match(/^[a-zA-Z]$/)){ 
        currentToken = {
            type:"endTag",
            tagName:""
        }
        return tagName(c)
    }else if(c == EOF){
        emit({
            type:"EOF"
        })
    }
}

function emit(token){
    let top = stack[stack.length - 1];
    if(token.type == 'startTag'){
        let element = {
            type:'element',
            children:[],
            attributes:[],
            parent:top
        }
        element.tagName = token.tagName
        for (let prop in token) {
            if(prop!=="type" && prop!=='tagName'){
                element.attributes.push({
                    name:prop,
                    value:token[prop]
                })
            }
        }
        
        top.children.push(element)

        if(!token.isSelfclosing){
            stack.push(element)
        }

        currentTextNode = null
    }else if(token.type == 'endTag'){
        if(top.tagName !== token.tagName){
            throw(new Error('Tag start end not match'))
        }else{
            stack.pop()//出栈
        }
        currentTextNode == null
    }else if(token.type == 'text'){
        if(currentTextNode == null){
            currentTextNode = {
                type:'text',
                content:""
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content
    }
}


module.exports.parseHTML = function parseHTML(html){
    let state = data;
    for (let c of html) {
        state = state(c)
        if(stack[stack.length-1].tagName === 'script' && state== data){
            state = scriptData
        }
    }
    state = state(EOF)
    return stack[0]
}


function scriptData(c){
    if(c === '<'){
        return scriptDataLessThanSign
    }else{
        emit({
            type:'text',
            content:c
        })
        return scriptData
    }
}
//in script received </
function scriptDataLessThanSign(c){
    if(c == '/'){
        return scriptDataEndTagOpen
    }else{
        emit({
            type:'text',
            content:"<"
        })
        emit({
            type:'text',
            content:c
        })
        return scriptData
    }
}
//in script received </
function scriptDataEndTagOpen(c){
    if(c == 's'){
        return scriptDataEndTagNameS
    }else{
        emit({
            type:'text',
            content:"<"
        })
        emit({
            type:'text',
            content:"/"
        })
        emit({
            type:'text',
            content:c
        })
        return scriptData
    }
}

//in script received </s
function scriptDataEndTagNameS(c){
    if(c == 'c'){
        return scriptDataEndTagNameC
    }else{
        emit({
            type:'text',
            content:"</s"
        })
        emit({
            type:'text',
            content:c
        })
        return scriptData
    }
}

//in script received </sc
function scriptDataEndTagNameC(c){
    if(c == 'r'){
        return scriptDataEndTagNameR
    }else{
        emit({
            type:'text',
            content:"</sc"
        })
        emit({
            type:'text',
            content:c
        })
        return scriptData
    }
}

//in script received </scr
function scriptDataEndTagNameR(c){
    if(c == 'i'){
        return scriptDataEndTagNameI
    }else{
        emit({
            type:'text',
            content:"</scr"
        })
        emit({
            type:'text',
            content:c
        })
        return scriptData
    }
}

//in script received </scri
function scriptDataEndTagNameI(c){
    if(c == 'p'){
        return scriptDataEndTagNameP
    }else{
        emit({
            type:'text',
            content:"</scri"
        })
        emit({
            type:'text',
            content:c
        })
        return scriptData
    }
}

//in script received </scrip
function scriptDataEndTagNameP(c){
    if(c == 't'){
        return scriptDataEndTag
    }else{
        emit({
            type:'text',
            content:"</scrip"
        })
        emit({
            type:'text',
            content:c
        })
        return scriptData
    }
}

//in script received </script :必须等到空白或者大于号
function scriptDataEndTag(c){
    if(c==' '){
        return scriptDataEndTag
    }
    if(c=='>'){
        emit({
            type:"endTag",
            tagName:"script"
        })
        //回到开始状态
        return data
    }else{
        emit({
            type:'text',
            content:"</script"
        })
        emit({
            type:'text',
            content:c
        })
        return scriptDataEndTagOpen
    }
}