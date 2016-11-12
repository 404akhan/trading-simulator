var PouchDB = require('pouchdb');
var db = new PouchDB('traders');
var db2 = new PouchDB('pulls');


/*************** create ***************/
function addTrader() {
  db.put({
    "name": "Akhan",
    "money": 5000000,
    "cur_pull_id": "6A010E44-FBA8-C339-B6B6-060F769E8039",
    "cur_pull_money": 500000,
    "pulls": ["6A010E44-FBA8-C339-B6B6-060F769E8039"],
    "history": []
  }, function (err, response) {
    if (err) {
      return console.log(err);
    }
    // handle response
    db2.get("6A010E44-FBA8-C339-B6B6-060F769E8039", function(err, doc) {

      doc.traders.push({
        "init_cash": 5000000,
        "cur_cash": 5000000,
        id: response.id
      });

      db2.put(doc, function(err, response) {
        if (err) { return console.log(err); }
      });
    });
  });
};

// addTrader();

// db2.get("6A010E44-FBA8-C339-B6B6-060F769E8039", function(err, doc) {
//
//   var arr = [];
//   for(var i = 0; i < doc.traders.length; i++) {
//
//     if(doc.traders[i].id !== '24C73840-2DDA-E20A-898B-29EEEC7FCC94') {
//
//       arr.push(doc.traders[i]);
//     }
//   }
//
//   doc.traders = arr;
//
//   db2.put(doc, function(err, response) {
//     if (err) { return console.log(err); }
//   });
// });

//
// db2.post({
//   traders: [
//     {
//       init_cash: 100000,
//       cur_cash: 100000,
//       id: "98F6E4E3-CC16-C676-89D6-B2EA7895D6EB"
//     },
//     {
//       init_cash: 300000,
//       cur_cash: 298914.8,
//       id: "FECD9ADA-F131-1D0D-8DCC-3F7CABDDD210"
//     }
//   ],
//   stocks: [
//     {
//       stock_symbol: "AAPL",
//       quantity: 10,
//       trader_id: "FECD9ADA-F131-1D0D-8DCC-3F7CABDDD210"
//     }
//   ],
//   "_id": "6A010E44-FBA8-C339-B6B6-060F769E8039",
//   "_rev": "4-14239f3c48d51b327b5ac8e5ee663afd",
//   history: [{
//     "stock_symbol": "AAPL",
//     "transaction": "buy",
//     "type": "market",
//     "price": 108.52,
//     "quantity": "10",
//     "trader_id": "FECD9ADA-F131-1D0D-8DCC-3F7CABDDD210"
//   }
//   ],
//   created_day: Date.now()
// }, function(err, response) {
//   if (err) { return console.log(err); }
//   // handle response
//   console.log(response);
// });

// db.changes().on('change', function() {
//   console.log('Ch-Ch-Changes');
// });

// db.replicate.to('http://example.com/mydb');

// db.allDocs({include_docs: true, descending: true}, function(err, doc) {
//   console.log(JSON.stringify(doc, null, 3));
// });

// db.put({
//   _id: '87E754C2-FF84-419C-A0FB-F9F06A70CB03',
//   _rev: '1-433aab9a2ec3213755c9ec8c50e177c9',
//   stocks: [{
//         'stock_symbol': 'AAPL',
//         'quantity': 100,
//       },{
//         'stock_symbol': 'GOOGL',
//         'quantity': 300,
//       }
//     ]
// }, function(err, response) {
//   if (err) { return console.log(err); }
//   // handle response
//   console.log(response);
// });
//
// db.changes().on('change', function() {
//   console.log('Ch-Ch-Changes');
// });

// db.replicate.to('http://example.com/mydb');

// db.get('E69EA752-4C19-8866-B5AC-12CE40BAAB33', function(err, doc) {
//   if (err) { return console.log(err); }
//   db.remove(doc, function(err, response) {
//     if (err) { return console.log(err); }
//     // handle response
//   });
// });

db.allDocs({include_docs: true, descending: true}, function(err, doc) {
  console.log(JSON.stringify(doc, null, 3));
});

db2.allDocs({include_docs: true, descending: true}, function(err, doc) {
  console.log(JSON.stringify(doc, null, 3));
});









/**************** update ******************/
// db.query(function(doc) {
//   var myId = '87E754C2-FF84-419C-A0FB-F9F06A70CB03';
//   if (doc._id === myId) {
//     emit(doc);
//   }
// }, {include_docs: true}, function (err, doc) {
//   if (err) { return console.log(err); }
//
//   console.log(JSON.stringify(doc.rows[0], null, 3));
//
//   db.put({
//     _id: doc.rows[0].doc._id,
//     _rev: doc.rows[0].doc._rev,
//     "name": "David",
//     "money": 500000,
//     stocks: [{
//         'stock_symbol': 'AAPL',
//         'quantity': 2000,
//       },{
//         'stock_symbol': 'GOOGL',
//         'quantity': 300,
//       }
//     ],
//     "trades": [],
//   }, function(err, response) {
//     if (err) { return console.log(err); }
//     // handle response
//     console.log(response);
//   });
// });

// db.get('123asd', function(err, doc) {
//   if (err) { return console.log(err); }
//   db.remove(doc, function(err, response) {
//     if (err) { return console.log(err); }
//     // handle response
//   });
// });