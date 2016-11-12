var util = require('util');
require('colors');
var _ = require('lodash');
var yahooFinance = require('./price/lib');
var DB = require('./db');

var fields = _.flatten([
  ['a', 'b', 'b2', 'b3', 'p', 'o'],
  ['n']
]);

// var Gun = require("../public/js/gun");
// var gun = Gun('https://gundb-server.herokuapp.com/gun').get('traders');

var Trade = {};

Trade.trade = function(trade) {

  var symbol = trade.stock_symbol;
  var trader_id = trade.trader_id;
  var quantity = parseInt(trade.quantity);
  var type = trade.type;

  if(trade.type === 'market') {

    if(trade.transaction === 'buy') {

      yahooFinance.snapshot({

        fields: fields,
        symbol: symbol
      }).then(function (snapshot) {

        var price = snapshot.ask;

        console.log(price, quantity, symbol, trader_id, type);
        DB.buy(price, quantity, symbol, trader_id, type);
      });
    }

    if(trade.transaction === 'sell') {

      yahooFinance.snapshot({

        fields: fields,
        symbol: symbol
      }).then(function (snapshot) {

        var price = snapshot.ask;

        console.log(price, quantity, symbol, trader_id, type);
        DB.sell(price, quantity, symbol, trader_id, type);
      });
    }
  }
};

module.exports = Trade;