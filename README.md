# api-poloniex

> Descripcion

# Contents

* [Install](#user-content-install)
* [Usage](#user-content-usage)
	* Public
	* Push
	* Trading
* [License](#user-content-license)

# Install

```bash
npm install api-poloniex --save
```

# Usage

Public api usage

```bash
const api = require('api-poloniex')();

api.public.returnTicker().then((ticker)=>{
    console.log(ticker.BTC_LTC);
}).catch((err)=>{
    console.log(err);
});
```

Push api usage

```bash
const api = require('api-poloniex')();

api.public.returnTicker().then((ticker)=>{
    console.log(ticker.BTC_LTC);
}).catch((err)=>{
    console.log(err);
});
```

Trading api usage

```bash
const apiKey = 'apiKey...........';
const secret = 'secret..................................';
const api = require('api-poloniex')(apiKey, secret);

api.trading.returnBalances().then((balances) => {
    console.log(balances.BTC);
})
```

# License

[MIT](http://vjpr.mit-license.org)
