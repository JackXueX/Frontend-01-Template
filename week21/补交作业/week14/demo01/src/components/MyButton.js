import React from 'react'

class MyButton extends React.Component {
  render() {
    return React.createElement(
      "a",
      {href: "#", color: "blue", shadowSize: 2},
      "Hello ABC",
      React.createElement("button", null, "AAA")
    );
  }
}

export default MyButton