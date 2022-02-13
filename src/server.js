const http = require('http'); // http module
const url = require('url'); // url module
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
  });
};

const handlePost = (request, response) => {
  parseBody(request, response, jsonHandler.addUser);
};

// object to route requests to proper handlers
const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': jsonHandler.getUsers,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsersMeta,
    notFound: jsonHandler.notFound,
  },
  POST: {
    '/addUser': handlePost,
  },
};

const onRequest = (request, response) => {
  // parse info from url
  const parsedUrl = url.parse(request.url);

  // grab accepted types
  const acceptedTypes = request.headers.accept.split(',');

  // handle the request. If no handler found, use notFound
  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response, acceptedTypes);
  } else {
    urlStruct[request.method].notFound(request, response, acceptedTypes);
  }
};

// start server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
