// 框架代码
function createElement(Cls, attributes, ...children) {
  let o;

  if (typeof Cls === "string") {
    o = new Wraper(Cls);
  } else {
    o = new Cls();
  }
  for (let name in attributes) {
    o.setAttribute(name, attributes[name]);
  }
  // console.log(children)
  for (let child of children) {
    if (typeof child === "string") {
      child = new Text(child);
    }
    o.appendChild(child);
  }
  return o;
}

class Text {
  constructor(text) {
    this.children = [];
    this.root = document.createTextNode(text);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

class Wraper {
  constructor(type) {
    this.children = [];
    this.root = document.createElement(type);
  }

  setAttribute(name, value) { // attribute
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    // this.root.appendChild(child);
    // child.mountTo(this.root);
    this.children.push(child);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
    for (let child of this.children) {
      child.mountTo(this.root);
    }
  }

  // appnedChild(child) { // children
  //   console.log('Parent::appendChild', child);
  // }
}
// 用户代码
class MyComponent {
  constructor(type) {
    this.children = [];
    this.root = document.createElement(type);
  }

  setAttribute(name, value) { // attribute
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    // this.root.appendChild(child);
    // child.mountTo(this.root);
    this.children.push(child);
  }

  render() {
    return <article>
      <header>I'am a header</header>
      {this.slot}
      <footer>I'am a footer</footer>
    </article>
  }

  mountTo(parent) {
    // parent.appendChild(this.root);
    this.slot = <div></div>
    for (let child of this.children) {
      this.slot.appendChild(child);
      // child.mountTo(this.root);
    }
    this.render().mountTo(parent);
  }

  // appnedChild(child) { // children
  //   console.log('Parent::appendChild', child);
  // }
}


// let component = <div id="a" class="b" style="width:100px;height:100px;background-color:green;">
//     <div></div>
//     <p>你好</p>
//     <div></div>
//     <div></div>
//   </div>

let component = <MyComponent>
  <div>text text text</div>
</MyComponent>

component.mountTo(document.body);
/*
var component = createElement(Parent, 
  {
    id: 'a',
    class: 'b'
  },
  createElement(Child, null),
  createElement(Child, null),
  createElement(Child, null)
);
*/

console.log(component);
// component.setAttribute('id', 'a');