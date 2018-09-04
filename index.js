/*
 * Primary file for the API
 *
 */

// Dependencies
const http = require('http');
const { URL } = require('url');


// The server should respond to all requests with a string
const server = http.createServer( (req,res) => {

  // Figuring out the user:password URL details
  // ref: https://stackoverflow.com/questions/48196706/new-url-whatwg-url-api?noredirect=1
  // ref: https://github.com/JoshuaWise/request-target
  // ref: curl localhost:3000/fubar/showMe.aspx?checkName=check#hash
  // ref: curl NMCcoder:MySecretPassword@localhost:3000/fubar/showMe.aspx?checkName=check#hash
  // ref: https://stackoverflow.com/questions/5951552/basic-http-authentication-in-node-js

  // Check for authorization header content
  function checkAuth() {
    if (req.headers && req.headers.authorization) {
      const header=req.headers.authorization;
      const token=header.split(/\s+/).pop()||'';
      const auth = new Buffer.from(token, 'base64').toString();
      const parts=auth.split(/:/);
      const username=parts[0];
      const password=parts[1];
      console.log(`Auth info:
        username: ${username}
        password: ${password}`);
      return 'http://'+username+':'+password+'@'+req.headers.host;
    }
    else {
      return 'http://'+req.headers.host;
    }
  }

  // Get the URL and parse it
  const baseURL = checkAuth();
  const parsedURL = new URL(req.url, baseURL);

  // Get the path from the URL
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Send the response
  const parsedResponse = (`Hello, here are your request details:

  url.hash......: ${parsedURL.hash}
  url.host......: ${parsedURL.host}
  url.hostname..: ${parsedURL.hostname}
  url.href......: ${parsedURL.href}
  url.origin....: ${parsedURL.origin}
  url.password..: ${parsedURL.password}
  url.pathname..: ${parsedURL.pathname}
  url.port......: ${parsedURL.port}
  url.protocol..: ${parsedURL.protocol}
  url.search....: ${parsedURL.search}
  url.username..: ${parsedURL.username}
  url.toString(): ${parsedURL.toString()}

  path..........: ${path}
  trimmedPath...: ${trimmedPath}\n`);

  // res.end(`Hello, your URL was: ${parsedURL.toString()}\n`);
  res.end(parsedResponse);

  // Log the request path

});

// Start the server and listen on port 3000
server.listen(3000, () => {
  console.log("The server is listening on port 3000 now");
});
