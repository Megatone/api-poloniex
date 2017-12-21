'use strict'

module.exports = (request, urlApiService, _apiKey, _secret) => {

    const crypto = require('crypto');
    const nonce = require('nonce')();
    const apiKey = _apiKey;
    const secret = _secret;

    const post = (command, parameters) => {
        let options = buildOptions(command, parameters);
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) reject(error);
                let obj = JSON.parse(body);
                resolve(obj);
            });
        });
    };

    const buildOptions = (command, parameters) => {
        let param = parameters;
        param.command = command;
        param.nonce = nonce(16);

        return {
            method: 'POST',
            url: urlApiService + 'tradingApi',
            form: parameters,
            headers: getPrivateHeaders(parameters),
        };
    };

    const getPrivateHeaders = (parameters) => {
        let paramString = Object.keys(parameters).map((param) => {
            return encodeURIComponent(param) + '=' + encodeURIComponent(parameters[param]);
        }).join('&');
        let signature = crypto.createHmac('sha512', secret).update(paramString).digest('hex');
        return {
            Key: apiKey,
            Sign: signature
        };
    };

    return {
        /**
         * Get Trading Api Key Value 
         * @return {String}
         */
        getApiKey: () => { return apiKey },

        /**
         * Get Secret Value 
         * @return {String}
         */
        getSecret: () => { return secret },

        /**
         * Set Trading Api Key Value 
         * @param {String} _apiKey         
         */
        setApiKey: (_apiKey) => { apiKey = _apiKey },

        /**
         * Set Secret Value 
         * @param {String} _secret      
         */
        setSecret: (_secret) => { secret = _secret },

        /**
         * Returns all of your available balances.
         * @return {Promise}
         */
        returnBalances: () => post('returnBalances', {}),

        /**
         * Returns all of your balances, including available balance, balance on orders, and the estimated BTC value of your balance.
         * By default, this call is limited to your exchange account; set the "account" POST parameter to "all" to include your margin and lending accounts.
         * @return {Promise}
         */
        returnCompleteBalances: () => post('returnCompleteBalances', {}),

        /**
         * Returns all of your deposit addresses.        
         * @return {Promise}
         */
        returnDepositAddresses: () => post('returnDepositAddresses', {}),

        /**
         * Generates a new deposit address for the currency specified by the "currency" POST parameter.
         * Only one address per currency per day may be generated, and a new address may not be generated before the previously-generated one has been used.
         * @param {String} currency
         * @return {Promise}
         */
        generateNewAddress: (currency) => post('generateNewAddress', { currency }),

        /**
         * Returns your deposit and withdrawal history within a range, specified by the "start" and "end" POST parameters, both of which should be given as UNIX timestamps.
         * @param {Number} start
         * @param {Number} end
         * @returns {Promise}
         */
        returnDepositsWithdrawals: (start, end) => post('returnDepositsWithdrawals', { start, end }),

        /**
         * Returns your open orders for a given market, specified by the "currencyPair" POST parameter, e.g. "BTC_XCP". 
         * Set "currencyPair" to "all" to return open orders for all markets. 
         * @param {String} currencyPair
         * @returns {Promise}
         */
        returnOpenOrders: (currencyPair) => post('returnOpenOrders', { currencyPair }),

        /**
         * Returns your trade history for a given market, specified by the "currencyPair" POST parameter.
         * You may specify "all" as the currencyPair to receive your trade history for all markets. 
         * You may optionally specify a range via "start" and/or "end" POST parameters, given in UNIX timestamp format; 
         * if you do not specify a range, it will be limited to one day. 
         * You may optionally limit the number of entries returned using the "limit" parameter, up to a maximum of 10,000.
         * If the "limit" parameter is not specified, no more than 500 entries will be returned.
         * @param {String} currencyPair
         * @param {Number} start
         * @param {Number} end
         * @param {Number} limit
         * @returns {Promise}
         */
        returnTradeHistory: (currencyPair, start, end, limit) => post('returnTradeHistory', { currencyPair, start, end, limit }),

        /**
         * Returns all trades involving a given order, specified by the "orderNumber" POST parameter.
         * If no trades for the order have occurred or you specify an order that does not belong to you, you will receive an error
         * @param {Number} orderNumber
         * @returns {Promise}
         */
        returnOrderTrades: (orderNumber) => post('returnOrderTrades', { orderNumber }),

        /**
         * Places a limit buy order in a given market.
         * Required POST parameters are "currencyPair", "rate", and "amount".
         * If successful, the method will return the order number.
         * You may optionally set "fillOrKill", "immediateOrCancel", "postOnly" to 1.
         * A fill-or-kill order will either fill in its entirety or be completely aborted.
         * An immediate-or-cancel order can be partially or completely filled, but any portion of the order that cannot be filled immediately will be canceled rather than left on the order book.
         * A post-only order will only be placed if no portion of it fills immediately; this guarantees you will never pay the taker fee on any part of the order that fills.
         * @param {String} currencyPair
         * @param {Number} rate
         * @param {NumberString} amount
         * @param {Number} fillOrKill
         * @param {Number} immediateOrCancel
         * @param {Number} postOnly
         * @returns {Promise}
         */
        buy: (currencyPair, rate, amount, fillOrKill, immediateOrCancel, postOnly) => post('buy', { currencyPair, rate, amount, fillOrKill, immediateOrCancel, postOnly }),

        /**
         * Places a sell order in a given market. Parameters and output are the same as for the buy method.
         * @param {String} currencyPair
         * @param {Number} rate
         * @param {NumberString} amount
         * @param {Number} fillOrKill
         * @param {Number} immediateOrCancel
         * @param {Number} postOnly
         * @returns {Promise}
         */
        sell: (currencyPair, rate, amount, fillOrKill, immediateOrCancel, postOnly) => post('sell', { currencyPair, rate, amount, fillOrKill, immediateOrCancel, postOnly }),

        /**
         * Cancels an order you have placed in a given market. Required POST parameter is "orderNumber".
         * @param {Number} orderNumber
         * @returns {Promise}
         */
        cancelOrder: (orderNumber) => post('cancelOrder', { orderNumber }),

        /**
         * Cancels an order and places a new one of the same type in a single atomic transaction, meaning either both operations will succeed or both will fail.
         * Required POST parameters are "orderNumber" and "rate"; you may optionally specify "amount" if you wish to change the amount of the new order. 
         * "postOnly" or "immediateOrCancel" may be specified for exchange orders, but will have no effect on margin orders.
         * @param {Number} orderNumber
         * @param {Number} rate
         * @param {Number} amount
         * @param {Number} postOnly
         * @param {Number} immediateOrCancel
         * @returns {Promise}
         */
        moveOrder: (orderNumber, rate, amount, postOnly, immediateOrCancel) => post('moveOrder', { orderNumber, rate, amount, postOnly, immediateOrCancel }),

        /**
         * Immediately places a withdrawal for a given currency, with no email confirmation.
         * In order to use this method, the withdrawal privilege must be enabled for your API key.
         * Required POST parameters are "currency", "amount", and "address".
         * For XMR withdrawals, you may optionally specify "paymentId".
         * @param {String} currency
         * @param {Number} amount
         * @param {String} address
         * @param {Number} paymentId
         * @returns {Promise}
         */
        withdraw: (currency, amount, address, paymentId) => post('withdraw', { currency, amount, address, paymentId }),

        /**
         * If you are enrolled in the maker-taker fee schedule, returns your current trading fees and trailing 30-day volume in BTC.
         * This information is updated once every 24 hours.         
         * @returns {Promise}
         */
        returnFeeInfo: () => post('returnFeeInfo', {}),

        /**
         * Returns your balances sorted by account. 
         * You may optionally specify the "account" POST parameter if you wish to fetch only the balances of one account.
         * Please note that balances in your margin account may not be accessible if you have any open margin positions or orders.
         * @param {String} account
         * @returns {Promise}
         */
        returnAvailableAccountBalances: (account) => post('returnAvailableAccountBalances', { account }),

        /**
         * Returns your current tradable balances for each currency in each market for which margin trading is enabled.
         * Please note that these balances may vary continually with market conditions.         
         * @returns {Promise}
         */
        returnTradableBalances: () => post('returnTradableBalances', {}),

        /**
         * Transfers funds from one account to another (e.g. from your exchange account to your margin account).
         * Required POST parameters are "currency", "amount", "fromAccount", and "toAccount".
         * @param {String} currency
         * @param {Number} amount
         * @param {String} fromAccount
         * @param {String} toAccount
         * @returns {Promise}
         */
        transferBalance: (currency, amount, fromAccount, toAccount) => post('transferBalance', { currency, amount, fromAccount, toAccount }),

        /**
         * Returns a summary of your entire margin account.
         * This is the same information you will find in the Margin Account section of the Margin Trading page, under the Markets list.    
         * @returns {Promise}
         */
        returnMarginAccountSummary: () => post('returnMarginAccountSummary', {}),

        /**
         * Places a margin buy order in a given market. 
         * Required POST parameters are "currencyPair", "rate", and "amount".
         * You may optionally specify a maximum lending rate using the "lendingRate" parameter.
         * If successful, the method will return the order number and any trades immediately resulting from your order.
         * @param {String} currencyPair
         * @param {Number} rate
         * @param {Number} amount
         * @param {Number} lendingRate
         * @returns {Promise}
         */
        marginBuy: (currencyPair, rate, amount, lendingRate) => post('marginBuy', { currencyPair, rate, amount, lendingRate }),

        /**
         * Places a margin sell order in a given market.
         * Parameters and output are the same as for the marginBuy method.
         * @returns {Promise}
         */
        marginSell: () => post('marginSell', {}),

        /**
         * Returns information about your margin position in a given market, specified by the "currencyPair" POST parameter.
         * You may set "currencyPair" to "all" if you wish to fetch all of your margin positions at once.
         * If you have no margin position in the specified market, "type" will be set to "none".
         * "liquidationPrice" is an estimate, and does not necessarily represent the price at which an actual forced liquidation will occur.
         * If you have no liquidation price, the value will be -1.
         * @param {String} currencyPair
         * @param {String} type
         * @param {Number} liquidationPrice
         * @returns {Promise}
         */
        getMarginPosition: (currencyPair, type, liquidationPrice) => post('getMarginPosition', { currencyPair, type, liquidationPrice }),

        /**
         * Closes your margin position in a given market (specified by the "currencyPair" POST parameter) using a market order.
         * This call will also return success if you do not have an open position in the specified market.
         * @param {String} currencyPair
         * @returns {Promise}
         */
        closeMarginPosition: (currencyPair) => post('closeMarginPosition', { currencyPair }),

        /**
         * Creates a loan offer for a given currency. 
         * Required POST parameters are "currency", "amount", "duration", "autoRenew" (0 or 1), and "lendingRate".
         * @param {String} currency
         * @param {Number} amount
         * @param {Number} duration
         * @param {Number} autoRenew
         * @param {Number} lendingRate
         * @returns {Promise}
         */
        createLoanOffer: (currency, amount, duration, autoRenew, lendingRate) => post('createLoanOffer', { currency, amount, duration, autoRenew, lendingRate }),

        /**
         * Cancels a loan offer specified by the "orderNumber" POST parameter.
         * @param {Number} orderNumber
         * @returns {Promise}
         */
        cancelLoanOffer: (orderNumber) => post('cancelLoanOffer', { orderNumber }),

        /**
         * Returns your open loan offers for each currency.        
         * @returns {Promise}
         */
        returnOpenLoanOffers: () => post('returnOpenLoanOffers', {}),

        /**
         * Returns your active loans for each currency.        
         * @returns {Promise}
         */
        returnActiveLoans: () => post('returnActiveLoans', {}),

        /**
         * Returns your lending history within a time range specified by the "start" and "end" POST parameters as UNIX timestamps.
         * "limit" may also be specified to limit the number of rows returned.
         * @param {Number} start
         * @param {Number} end
         * @param {Number} limit
         * @returns {Promise}
         */
        returnLendingHistory: (start, end, limit) => post('returnLendingHistory', { start, end, limit }),

        /**
         * Toggles the autoRen        
         * @returns {Promise}
         */
        toggleAutoRenew: () => post('toggleAutoRenew', {})
    };
}
