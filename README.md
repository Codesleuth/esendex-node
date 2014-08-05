esendex-node
============

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][codeship-url] [![Codeship Status for Codesleuth/esendex-node][codeship-image]][codeship-url]
[![NPM][npmico-image]][npmico-url]

A work-in-progress simplistic client library for the [Esendex](http://esendex.com) [REST API](http://developers.esendex.com/APIs/REST-API).

## Getting Started

1. Clone the repo: `git clone https://github.com/codesleuth/esendex-node && cd esendex-node`
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

See the [examples](https://github.com/Codesleuth/esendex-node/tree/master/examples).

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