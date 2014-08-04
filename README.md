esendex-node
============

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