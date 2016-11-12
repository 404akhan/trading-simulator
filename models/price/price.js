var util = require('util');

require('colors');

var _ = require('lodash');
var yahooFinance = require('./lib');

var FIELDS = _.flatten([
  ['a', 'b', 'b2', 'b3', 'p', 'o'],
  ['n']
]);

var SYMBOL = 'AAPL';

yahooFinance.snapshot({
  fields: FIELDS,
  symbol: SYMBOL
}).then(function (snapshot) {
  console.log(util.format('=== %s ===', SYMBOL).cyan);
  console.log(JSON.stringify(snapshot, null, 2));
});