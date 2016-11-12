var PouchDB = require('pouchdb');
var traders = new PouchDB('traders');
var pulls = new PouchDB('pulls');

var DB = {};


DB.buy = function(price, quantity, symbol, trader_id, type) {

  traders.get(trader_id, function(err, doc) {
    if (err) { return console.log(err); }

    if(doc.cur_pull_money < price * quantity)
      return; // error

    doc.cur_pull_money -= price * quantity;
    doc.history.push({
      'stock_symbol': symbol,
      'transaction': 'buy',
      'type': type,
      'price': price,
      'quantity': quantity,
      'group': doc.cur_pull_id
    });


    var pull_id = doc.cur_pull_id;

    traders.put(doc, function(err, response) {
      if (err) { return console.log(err); }

      pulls.get(pull_id, function(err, doc) {
        if (err) { return console.log(err); }

        var change = false;
        for(var i = 0; i < doc.stocks.length; i++) {

          if(doc.stocks[i].stock_symbol === symbol && doc.stocks[i].trader_id === trader_id) {

            doc.stocks[i].quantity += quantity;
            change = true;
            break;
          }
        }

        if(!change) {

          doc.stocks.push({
            stock_symbol: symbol,
            quantity: quantity,
            trader_id: trader_id
          });
        }

        doc.history.push({
          'stock_symbol': symbol,
          'transaction': 'buy',
          'type': type,
          'price': price,
          'quantity': quantity,
          'trader_id': trader_id
        });

        for(var i = 0; i < doc.traders.length; i++) {

          if(doc.traders[i].id === trader_id) {

            doc.traders[i].cur_cash -= price * quantity;
          }
        }

        pulls.put(doc, function(err, response) {
          if (err) { return console.log(err); }
        });
      });
    });
  });
};

DB.sell = function(price, quantity, symbol, trader_id, type) {

  traders.get(trader_id, function(err, doc_trader) {
    if (err) { return console.log(err); }

    var pull_id = doc_trader.cur_pull_id;

    pulls.get(pull_id, function(err, doc_pull) {
      if (err) { return console.log(err); }

      for(var i = 0; i < doc_pull.stocks.length; i++) {

        if(doc_pull.stocks[i].stock_symbol === symbol && doc_pull.stocks[i].trader_id === trader_id) {
console.log('here1');
          if(doc_pull.stocks[i].quantity >= quantity) {
            console.log('here2');

            doc_pull.stocks[i].quantity -= quantity;


            var total_cash = 0;
            for(var i = 0; i < doc_pull.traders.length; i++) {

              total_cash += doc_pull.traders[i].init_cash;
            }

            doc_pull.history.push({
              'stock_symbol': symbol,
              'transaction': 'sell',
              'type': type,
              'price': price,
              'quantity': quantity,
              'trader_id': trader_id
            });

            pulls.put(doc_pull, function(err, response) {
              if (err) { return console.log(err); }
            });

            var total_share = price * quantity;
            for(var i = 0; i < doc_pull.traders.length; i++) {

              var add = total_share * doc_pull.traders[i].init_cash / total_cash;

              (function(trader_id, add_money){

                traders.get(trader_id, function(err, doc_trader_local) {
                  if (err) { return console.log(err); }

                  doc_trader_local.money += add_money;

                  doc_trader_local.history.push({
                    added_pull_money: add_money,
                    added_pull_id: pull_id
                  });

                  traders.put(doc_trader_local, function(err, response) {
                    if (err) { return console.log(err); }
                  });
                });
              })(doc_pull.traders[i].id, add);
            }
          }
        }
      }

      return; // error
    });
  });
};

module.exports = DB;