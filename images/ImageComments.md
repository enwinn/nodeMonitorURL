# Image Comments
Below are annotation or comments above each image explaining what each image is capturing.

## WHATWG_URL_searchParams.png
nodeMonitorURL is using Node.js code written for ES6 as much as possible while being conformant to the LTS 8.x version with minimal to no external modules or experimental modes. This screenshot is capturing the use of the [v8.x WHATWG URL API](https://nodejs.org/dist/latest-v8.x/docs/api/url.html#url_the_whatwg_url_api "The WHATWG URL API").

The Node.js documentation does a pretty good job using examples with URLs constructed like this:

```javascript
const { URL } = require('url');
const myURL = new URL('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');
```

But it doesn't do a good job about how to use it with an HTTP Request so you can use the [URLSearchParams object methods](https://nodejs.org/dist/latest-v8.x/docs/api/url.html#url_class_urlsearchparams "WHATWG URLSearchParams interface") in lieu of using the [Legacy url.parse method](https://nodejs.org/dist/latest-v8.x/docs/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost "Legacy url.parse method") to parse the URL and then create a [queryStringObject](https://nodejs.org/dist/latest-v8.x/docs/api/url.html#url_urlobject_query "Legacy urlObject.query"). This is mildly annoying since the documentation states, "New application code should use the WHATWG API."

In the image below, you can see the following:
* Line 8 is accessing the WHATWG URL and URLSearchParams classes from the built-in url module
* Line 21 is a function that builds a URL string similar to the Node.js document example above which will then be passed to the WHATWG URL API constructor on line 41.
  * Line 22 checks to see if there is a headers object and if it includes an authorization header. If so...
    * Line 23 grabs just the auth header like this:
      * ```header="Basic RWxsaW90R291bGQ6U3VwZXJTZWNyZXRQYXNzQHdvcmQ="```
    * Line 24 splits the ```header``` value on whitespace and pops off the last value which is the Base65 encoded authorization token:
      * ```token="RWxsaW90R291bGQ6U3VwZXJTZWNyZXRQYXNzQHdvcmQ="```
    * Line 25 will base64 decode the value in token to a string like this:
      * ```auth="ElliotGould:SuperSecretPass@word"```
    * Line 26 will split auth into parts:
      * ```parts=Array(2) ["ElliotGould", "SuperSecretPass@word"]```
    * Line 27 grabs just the username:
      * ```username="ElliotGould"```
    * Line 28 grabs just the password:
      * ```password="SuperSecretPass@word"```
    * Line 29-31 is a console debug statement to display the results of parsing the incoming auth header (if present).
    * Line 32 builds the URL string the WHATWG URL API constructor is expecting (if there is an auth header)
  * Line 35 builds the URL string the WHATWG URL API constructor is expecting (if there is no auth header)
* Line 40 stores the output of the buildUri() function:
* Line 41 is the WHATWG URL constructor and will create a URL object (parsedURL) from the inputs:
  * ```req.url = "/sample/?vscodeDebugConfigs=rock%21"```
  * ```baseURL = "http://ElliotGould:SuperSecretPass@word@localhost:3000/sample/?vscodeDebugConfigs=rock%21"```
  * ```parsedURL = URL object```
* Line 44 gets the URL.pathname property:
  * ```path = "/sample/"```
* Line 45 trims off any preceding or trailing slashes:
  * ```trimmedPath = "sample"```
* Line 48 is the WHATWG URLSearchParams constructor:
  * ```searchParams = URLSearchParams object```
* Line 51 will be used in a later refactor
* Line 54-56 iterates through all of the querystring parameters that you see in the DEBUG CONSOLE at the bottom of the image.

Using the Legacy URL API to get the querystring contents is usually done by doing something like this:

```js
const parsedUrl = url.parse(req.url,true);
const queryStringObject = parsedUrl.query;
```

Compared to using the WHATWG URL API:

```js
const parsedURL = new URL(req.url, baseURL);
const searchParams = new URLSearchParams(parsedURL.searchParams);
```

The WHATWG URL <span style="color:green;">searchParams</span> object is synonomous to the Legacy URL <span style="color:green;">queryStringObject</span> object based on the two code blocks above.


![WHATWG URL searchParams](./WHATWG_URL_searchParams.png "WHATWG URL searchParams code exmaple")