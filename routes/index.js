var express = require('express');
var router = express.Router();

var Trades = require('../models/trades');
var DB = require('../models/db');

router.get('/', function(req, res, next) {

  res.locals.page = '/';
  res.render('index');
});

router.post('/trade', function(req, res, next) {

  var trader_id = 'FECD9ADA-F131-1D0D-8DCC-3F7CABDDD210';

  var trade = {
    trader_id: trader_id,
    stock_symbol: req.body.stock_symbol,
    transaction: req.body.transaction,
    quantity: req.body.quantity,
    type: req.body.type,
    // limit_price: req.body.limit_price,
    // conf: req.body.conf
  };

  Trades.trade(trade);

  res.sendStatus(200);
});

router.get('/data/:id', function(req, res, next) {

  var trader_id = 'FECD9ADA-F131-1D0D-8DCC-3F7CABDDD210';

  DB.getData(trader_id).then(data => {
    res.json(data);
  }, err => {
    res.json(err);
  });
});

module.exports = router;