esendex-node
============

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Codeship Status for Codesleuth/esendex-node][codeship-image]][codeship-url]
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
* Run `gulp` to ensure your code is lint free and all tests pass before you push
* Please ensure 100% unit test coverage for any changes (examples folder exempt for now)

[npm-image]: http://img.shields.io/npm/v/esendex.svg
[npm-url]: https://npmjs.org/package/esendex

[travis-image]: https://travis-ci.org/Codesleuth/esendex-node.svg?branch=master
[travis-url]: https://travis-ci.org/Codesleuth/esendex-node

[coveralls-image]: https://coveralls.io/repos/Codesleuth/esendex-node/badge.png
[coveralls-url]: https://coveralls.io/r/Codesleuth/esendex-node

[codeship-image]: https://www.codeship.io/projects/51dfa190-ff1b-0131-5487-5eefab01992e/status
[codeship-url]: https://www.codeship.io/projects/29670

[npmico-image]: https://nodei.co/npm/esendex.png
[npmico-url]: https://nodei.co/npm/esendex/
