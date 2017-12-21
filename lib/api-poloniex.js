'use strict'

module.exports = (apiKey = null, secret = null) => {

    const request = require('request');
    const urlApiService = 'https://poloniex.com/';
    const apiPublic = require('./api-public')(request, urlApiService);
    const apiTrading = require('./api-trading')(request, urlApiService, apiKey, secret);
  
    return {
        public: apiPublic,
        trading: apiTrading
    }
}



