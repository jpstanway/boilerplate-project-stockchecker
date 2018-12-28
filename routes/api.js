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
    const stock = req.query.stock;
    const like = req.query.like === "true" ? true : false;
    const ip = req.connection.remoteAddress;
    console.log(like);
    stockPrices.getPrice(stock, (obj, priceData) => {
      // retrieve and/or add likes to db
      stockPrices.handleLikes(stock, like, ip, (obj, likeData) => {
        // return stockData object
        res.json({
          [obj]: { stock: stock, price: priceData, likes: likeData.likes }
        });
      });
    });
  });
};
