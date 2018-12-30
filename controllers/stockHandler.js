/*
 *
 *
 *       Complete the handler logic below
 *
 *
 */
var MongoClient = require("mongodb").MongoClient;
const CONNECTION_STRING = process.env.DB;
var request = require("request");

function StockHandler() {
  this.getPrice = stock => {
    return new Promise((resolve, reject) => {
      // get data from api
      request(
        `https://api.iextrading.com/1.0/stock/${stock}/price`,
        (err, res, body) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(body));
          }
        }
      );
    });
  };

  this.handleLikes = (stock, like, ip) => {
    return new Promise((resolve, reject) => {
      // connect to db and either add to or just retrieve like data
      MongoClient.connect(
        CONNECTION_STRING,
        function(err, db) {
          if (err) {
            reject(err);
          } else {
            const collection = db.collection("stock_likes");
            if (!like) {
              collection.find({ stock: stock }).toArray(function(err, doc) {
                var likes = 0;
                if (doc.length > 0) {
                  likes = doc[0].likes.length;
                }
                resolve({ stock: stock, likes: likes });
              });
            } else {
              collection.findAndModify(
                { stock: stock },
                [],
                { $addToSet: { likes: ip } },
                { new: true, upsert: true },
                function(err, doc) {
                  resolve({ stock: stock, likes: doc.value.likes.length });
                }
              );
            }
          }
        }
      );
    });
  };
}

module.exports = StockHandler;
