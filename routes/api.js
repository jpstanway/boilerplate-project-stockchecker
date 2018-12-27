/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var StockHandler = require("../controllers/stockHandler.js");
var request = require("request");

module.exports = function(app) {
  var stockPrices = new StockHandler();

  app.route("/api/stock-prices").get(function(req, res) {
    const stock = req.query.stock;

    function getPrice(obj, data) {
      console.log(obj, data);
    }

    stockPrices.getData(stock, getPrice);
  });
};
