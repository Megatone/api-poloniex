'use strict'

module.exports = (request, urlApiService) => {

    const get = (target) => {
        return new Promise((resolve, reject) => {
            request(urlApiService + 'public?command=' + target, (error, response, body) => {
                if (error) reject(error);
                let obj = JSON.parse(body);
                resolve(obj);
            });
        });
    };

    return {
        /**
        * Returns the ticker for all markets.
        * @return {Promise} 
        */
        returnTicker: () => get('returnTicker'),

        /**
         * Returns the 24-hour volume for all markets, plus totals for primary currencies.
         * @return {Promise} 
         */
        return24hVolume: () => get('return24hVolume'),

        /**
         * Returns the order book for a given market, as well as a sequence number for use with the Push API and an indicator specifying whether the market is frozen.
         * You may set currencyPair to "all" to get the order books of all markets.
         * 
         * @param {String} currencyPair 
         * @param {Number} depth 
         * @return {Promise} 
         */
        returnOrderBook: (currencyPair, depth) => get('returnOrderBook&currencyPair=' + currencyPair + '&depth=' + depth),

        /**
         * Returns the past 200 trades for a given market, or up to 50,000 trades between a range specified in UNIX timestamps by the "start" and "end" GET parameters.
         * @param {String} currencyPair
         * @param {Date} start 
         * @param {Date} end 
         * @return {Promise} 
         */
        returnTradeHistory: (currencyPair, start, end) => get('returnTradeHistory&currencyPair=' + currencyPair + '&start=' + start + '&end=' + end),

        /**
         * Returns candlestick chart data. Required GET parameters are "currencyPair", "period" (candlestick period in seconds; valid values are 300, 900, 1800, 7200, 14400, and 86400), "start", and "end".
         * "Start" and "end" are given in UNIX timestamp format and used to specify the date range for the data returned.
         * @param {String} currencyPair
         * @param {Date} start 
         * @param {Date} end 
         * @param {Number} period 
         * @return {Promise} 
         */
        returnChartData: (currencyPair, start, end, period) => get('returnChartData&currencyPair=' + currencyPair + '&start=' + start + '&end=' + end + '&period=' + period),

        /**
        * Returns information about currencies.
        * @return {Promise} 
        */
        returnCurrencies: () => get('returnCurrencies'),

        /**
        * Returns the list of loan offers and demands for a given currency, specified by the "currency" GET parameter. 
        * @param {String} currency 
        * @return {Promise} 
        */
        returnLoanOrders: (currency) => get('returnLoanOrders&currency=' + currency)
    };
};

