esendex-node
============

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]
[![NPM][npmico-image]][npmico-url]

A work-in-progress simplistic client library for the [Esendex](http://esendex.com) [REST API](http://developers.esendex.com/APIs/REST-API).

## Getting Started

1. Install via npm: `npm install esendex`
2. Install the dependencies: `npm install`
3. Use!

```js
var esendex = require('esendex')({
  username: "myself@mydomain.com",
  password: "super-secret-password"
});

esendex.messages.get({count: 3}, function (err, messages) {
  console.log(err || messages);
});
```

## Example Scripts

There's a number of example scripts that show the client library in action. Take a look at the  [examples directory](https://github.com/Codesleuth/esendex-node/tree/master/examples).

## Contributions

Pull requests are welcome, but there are some rules:

* Please adhere to the coding style implied from existing code
* Run `npm test` to ensure your code is lint free and all tests pass before you push
* Please cover all changes with sufficient tests (examples folder exempt for now)

[npm-image]: http://img.shields.io/npm/v/esendex.svg
[npm-url]: https://npmjs.org/package/esendex

[travis-image]: https://travis-ci.org/esendex/esendex-node-sdk.svg?branch=master
[travis-url]: https://travis-ci.org/esendex/esendex-node-sdk

[npmico-image]: https://nodei.co/npm/esendex.png
[npmico-url]: https://nodei.co/npm/esendex/
