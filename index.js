/*
 * Primary file for the API
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const { URL, URLSearchParams } = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

// Instantiating the HTTP server
const httpServer = http.createServer( (req,res) => {
  unifiedServer(req,res);
});

// Start the HTTP server and listen on the configuration mode port
httpServer.listen(config.httpPort, () => {
  console.log(`The HTTP server is listening on port ${config.httpPort} in ${config.envName} mode`);
});

// Set the HTTPS config options
const httpsServerOptions= {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
}

// Instantiate the HTTPS server
const httpsServer = https.createServer( httpsServerOptions, (req,res) => {
  unifiedServer(req,res);
});

// Start the HTTPS server and listen on the configuration mode port
httpsServer.listen(config.httpsPort, () => {
  console.log(`The HTTPS server is listening on port ${config.httpsPort} in ${config.envName} mode`);
});

// Unified http and https functionality
const unifiedServer = (req,res) => {

  // Check for authorization header content
  function buildUri() {
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
        return  `http://${username}:${password}@${req.headers.host}${req.url}`;
    }
    else {
      return `http://${req.headers.host}${req.url}`;
    }
  }

  // Get the URL and parse it
  const baseURL = buildUri();
  const parsedURL = new URL(req.url, baseURL);

  // Get the path from the URL
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get the query string using URLSearchParams
  const searchParams = new URLSearchParams(parsedURL.searchParams);

  // Get the HTTP Method
  const method = req.method.toUpperCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    // Choose the handler this request should go to.
    // If one is not found, use the notFound handler
    const chosenHandler = typeof(router[trimmedPath]) != 'undefined' ? router[trimmedPath] : handlers.notFount;

    // Construct the data object to send to the handler
    const data = {
      'trimmedPath' : trimmedPath,
      'searchParams' : searchParams,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Use the payload called back by the handler, or default to an empty object
      payload = typeof(payload) == 'object' ? payload : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Populate the console content
      const parsedResponse = (`Hello, here are your request details:

      parsedURL.hash.........: ${parsedURL.hash}
      parsedURL.host.........: ${parsedURL.host}
      parsedURL.hostname.....: ${parsedURL.hostname}
      parsedURL.href.........: ${parsedURL.href}
      parsedURL.origin.......: ${parsedURL.origin}
      parsedURL.password.....: ${parsedURL.password}
      parsedURL.pathname.....: ${parsedURL.pathname}
      parsedURL.port.........: ${parsedURL.port}
      parsedURL.protocol.....: ${parsedURL.protocol}
      parsedURL.search.......: ${parsedURL.search}
      parsedURL.searchParams.: ${parsedURL.searchParams}
      parsedURL.username.....: ${parsedURL.username}
      parsedURL.toString()...: ${parsedURL.toString()}

      path...................: ${path}
      trimmedPath............: ${trimmedPath}
      method.................: ${method}
      searchParams...........: ${searchParams.toString()}
      headers................: \n${JSON.stringify(headers,null, 2)}
      payload................: ${buffer}\n`);

      // Log the request details
      console.log(parsedResponse+'\n');
      console.log('Returning this response: ', statusCode, payloadString);

    });
  });
};

// Define the handlers
const handlers = {};

//Sample handler
handlers.sample = (data, callback) => {
  // Callback an HTTP Status Code, and a payload object
  callback(406,{'name' : 'sample handler'});
};

// Not found handler
handlers.notFount = (data, callback) => {
  callback(404);
};

// Define a request router
const router = {
  'sample' : handlers.sample
};
