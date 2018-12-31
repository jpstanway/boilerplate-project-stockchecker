/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const expect = require("chai").expect;
const StockHandler = require("../controllers/stockHandler.js");
const MongoClient = require("mongodb").MongoClient;
const CONNECTION = process.env.DB;

module.exports = function(app) {
  var stockPrices = new StockHandler();

  app.route("/api/stock-prices").get(function(req, res) {
    expect(req.query).to.be.an("object");
    const stock = req.query.stock;
    const like = req.query.like || false;
    const ip = req.connection.remoteAddress;

    if (Array.isArray(stock)) {
      // process and compare multiple stocks
      const stockData = [];
      const price1 = stockPrices.getPrice(stock[0]);
      const likes1 = stockPrices.handleLikes(stock[0]);
      const price2 = stockPrices.getPrice(stock[1]);
      const likes2 = stockPrices.handleLikes(stock[1]);

      price1
        .then(priceData1 => {
          const stock1 = {};
          stock1.stock = stock[0];
          stock1.price = priceData1;

          price2
            .then(priceData2 => {
              const stock2 = {};
              stock2.stock = stock[1];
              stock2.price = priceData2;

              likes1
                .then(likeData1 => {
                  likes2
                    .then(likeData2 => {
                      stock1.rel_likes = likeData1.likes - likeData2.likes;
                      stock2.rel_likes = likeData2.likes - likeData1.likes;

                      stockData.push(stock1);
                      stockData.push(stock2);

                      res.json({ stockData });
                    })
                    .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    } else {
      // regular process for one stock only
      const stockData = { stock: stock };
      const price = stockPrices.getPrice(stock);
      const likes = stockPrices.handleLikes(stock, like, ip);

      price
        .then(priceData => {
          stockData.price = priceData;

          likes
            .then(likeData => {
              stockData.likes = likeData.likes;
              res.json({ stockData });
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
  });
};
