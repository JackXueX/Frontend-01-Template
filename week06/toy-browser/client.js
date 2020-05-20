const net = require('net');
const parser = require('./parser.js');
class Request {
  // method, url = host + port + path
  // body:k/v
  // headers
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || "/";
    this.body = options.body || {};
    this.headers = options.headers || {};
    if(!this.headers["Content-Type"]){
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    if(this.headers["Content-Type"] === "application/json"){
      this.bodyText = JSON.stringify(this.body);
    }else if(this.headers["Content-Type"] === "application/x-www-form-urlencoded"){
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join("&");
    }

    this.headers["Content-Length"] = this.bodyText.length;
  }
  
  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join("\r\n")}\r
\r
${this.bodyText}`
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser;
      if(connection){
        connection.write(this.toString());
      }else{
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString());
        })
      }

      connection.on('data', (data) => {
        parser.receive(data.toString());
        if(parser.isFinished){
          resolve(parser.response);
        }
        // console.log(parser.statusLine);
        console.log(parser.headers);
        // resolve(data.toString());
        connection.end();
      });

      connection.on('error', (err) => {
        reject(err);
        connection.end();
      });
    })
    
  }
}

class Response {
  
}

class ResponseParser {
  // 状态机
  constructor() {
    this.WATTING_STATUS_LINE = 0;
    this.WATTING_STATUS_LINE_END = 1;
    this.WATTING_HEADER_NAME = 2;
    this.WATTING_HEADER_SPACE = 3;
    this.WATTING_HEADER_VALUE = 4;
    this.WATTING_HEADER_LINE_END = 5;
    this.WATTING_HEADER_BLOCK_END = 6;
    this.WATTING_BODY = 7;

    this.current = this.WATTING_STATUS_LINE; //当前状态
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParser = null;
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFINISHED;
  }

  get response(){
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  } 

  receive(string) {
    for(let i = 0; i < string.length; i++){
      this.receiveChar(string.charAt(i));
    }
  }

  receiveChar(char){
    if(this.current === this.WATTING_STATUS_LINE){
      // console.log(char.charCodeAt(0));
      if (char === "\r") {
        // console.log("\\r");
        this.current = this.WATTING_STATUS_LINE_END;
      } else if (char === "\n") {
        this.current = this.WATTING_HEADER_NAME;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WATTING_STATUS_LINE_END){
      if (char === "\n") {
        this.current = this.WATTING_HEADER_NAME;
      }
    } else if (this.current === this.WATTING_HEADER_NAME){
      // console.log(char.charCodeAt(0));
      // console.log(char);
      if (char === ":") {
        this.current = this.WATTING_HEADER_SPACE;
      } else if (char === "\r") {
        this.current = this.WATTING_HEADER_BLOCK_END;
        if(this.headers["Transfer-Encoding"] === "chunked"){
          this.bodyParser = new TrunkedBodyParser();
        }
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WATTING_HEADER_SPACE){
      // console.log(char.charCodeAt(0));
      if (char === " ") {
        this.current = this.WATTING_HEADER_VALUE;
      }
    } else if (this.current === this.WATTING_HEADER_VALUE){
      if (char === "\r") {
        this.current = this.WATTING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerValue = "";
        this.headerName = "";
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WATTING_HEADER_LINE_END){
      // console.log(char.charCodeAt(0));
      if (char === "\n") {
        this.current = this.WATTING_HEADER_NAME;
      }
    } else if (this.current === this.WATTING_HEADER_BLOCK_END){
      if (char === "\n") {
        this.current = this.WATTING_BODY;
      }
    } else if (this.current === this.WATTING_BODY){
      this.bodyParser.receiveChar(char);
    }
  }
}

class TrunkedBodyParser {
  constructor() {
    this.WATTING_LENGTH = 0;
    this.WATTING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WATTING_NEW_LINE = 3;
    this.WATTING_NEW_LINE_END = 4;
    this.length = 0;
    this.content = [];
    this.isFINISHED = false;
    this.current = this.WATTING_LENGTH;
  }

  receiveChar(char) {
    // console.log(JSON.stringify(char));
    // console.log(this.current);
    if(this.current === this.WATTING_LENGTH){
      if (char === "\r") {
        if(this.length === 0){
          // console.log(this.content);
          // console.log('/////////');
          this.isFINISHED = true;
        }
        this.current = this.WATTING_LENGTH_LINE_END;
      } else {
        this.length *= 16;
        // this.length += Number(char);
        this.length += parseInt(char, 16);
      }
    }else if(this.current === this.WATTING_LENGTH_LINE_END){
      if (char === "\n") {
        this.current = this.READING_TRUNK;
      }
    }else if(this.current === this.READING_TRUNK){
      this.content.push(char);
      this.length--;
      if(this.length === 0){
        this.current = this.WATTING_NEW_LINE;
      }
    }else if(this.current === this.WATTING_NEW_LINE){
      if (char === "\r") {
        this.current = this.WATTING_NEW_LINE_END;
      }
    }else if(this.current === this.WATTING_NEW_LINE_END){
      if (char === "\n") {
        this.current = this.WATTING_LENGTH;
      }
    }
  }
}


// 调用api
void async function() {
  let request = new  Request({
    method: 'POST',
    host: '127.0.0.1',
    port: '8090',
    headers: {
      ['X-Foo2']: 'customed'
    },
    body: {
      name: 'winter'
    }
  })
  
  let response = await request.send();
  console.log(response);
  let dom = parser.parseHTML(response.body);
}();


/*
const client = net.createConnection(
  { 
    port: 8090 
  }, () => {
    console.log('connected to server!');
    let request = new  Request({
      method: 'POST',
      host: '127.0.0.1',
      port: '8090',
      headers: {
        ['X-Foo2']: 'customed'
      },
      body: {
        name: 'winter'
      }
    })
    client.write(request.toString())
    // console.log(request.toString())
  // 'connect' listener.
//   client.write(`
// POST / HTTP/1.1\r
// Content-Type: application/x-www-form-urlencoded\r
// Content-Length: 11\r
// \r
// name=winter`);
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
*/