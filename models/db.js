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

      for(var index = 0; index < doc_pull.stocks.length; index++) {

        (function(i){

          if(doc_pull.stocks[i].stock_symbol === symbol && doc_pull.stocks[i].trader_id === trader_id) {
            console.log('here1');
            if(doc_pull.stocks[i].quantity >= quantity) {
              console.log('here2');

              doc_pull.stocks[i].quantity -= quantity


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
              for(var index2 = 0; index2 < doc_pull.traders.length; index2++) {

                var add = total_share * doc_pull.traders[index2].init_cash / total_cash;

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
                })(doc_pull.traders[index2].id, add);
              }
            }
          }
        })(index);
      }

      return; // error
    });
  });
};

DB.getData = function(id) {
  return new Promise((resolve, reject) => {
    var obj_send = {};
    // console.log(id);

    traders.get(id, function(err, doc_trader) {
      if (err)
        reject(err);
      else {
        // console.log(doc_trader);
        obj_send.total_money = doc_trader.money;
        obj_send.cur_cluster_money = doc_trader.cur_pull_money;
        obj_send.cur_cluster_init_money = 0;
        obj_send.cur_cluster_stocks = [];

        pulls.get(doc_trader.cur_pull_id, function(err, doc_pull) {
          if (err)
            reject(err);
          else {
            for (var i = 0; i < doc_pull.traders.length; i++) {

              if(doc_pull.traders[i].id === id) {

                obj_send.cur_cluster_init_money = doc_pull.traders[i].init_cash;
              }
            }
            for (var i = 0; i < doc_pull.stocks.length; i++) {

              if (doc_pull.stocks[i].trader_id === id) {

                obj_send.cur_cluster_stocks.push({
                  stock_symbol: doc_pull.stocks[i].stock_symbol,
                  quantity: doc_pull.stocks[i].quantity
                });
                resolve(obj_send)
              }
            }
          }
        });
      }
      });
  });
};

DB.getCluster = function(cluster_id) {
  return new Promise((resolve, reject) => {

    var arr_send = [];

    pulls.get(cluster_id, function(err, doc_pull) {
      if (err)
        reject(err);
      else {
        for (var i = 0; i < doc_pull.traders.length; i++) {

          arr_send.push(doc_pull.traders[i].id);
        }

        resolve(arr_send);
      }
    });
  });
};


module.exports = DB;