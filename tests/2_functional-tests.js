/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("GET /api/stock-prices => stockData object", function() {
    test("1 stock", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog" })
        .end(function(err, res) {
          //complete this one too
          if (err) return done(err);
          assert.equal(res.status, 200);
          assert.isObject(res.body.stockData, "stockData should be an object");
          assert.property(
            res.body.stockData,
            "stock",
            "data should contain stock name"
          );
          assert.property(
            res.body.stockData,
            "price",
            "data should contain price of stock"
          );
          done(null, res);
        });
    });

    test("1 stock with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "ba", like: "true" })
        .end((err, res) => {
          if (err) return done(err);
          assert.equal(res.status, 200);
          assert.isObject(res.body.stockData, "stockData should be an object");
          assert.property(
            res.body.stockData,
            "stock",
            "data should contain stock name"
          );
          assert.property(
            res.body.stockData,
            "price",
            "data should contain price of stock"
          );
          assert.property(
            res.body.stockData,
            "likes",
            "data should contain likes property"
          );
          assert.isAbove(
            res.body.stockData.likes,
            0,
            "likes should be above 0"
          );
          done(null, res);
        });
    });

    test("1 stock with like again (ensure likes arent double counted)", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "ba", like: "true" })
        .end((err, res) => {
          if (err) return done(err);
          assert.equal(res.status, 200);
          assert.isObject(res.body.stockData, "stockData should be an object");
          assert.property(
            res.body.stockData,
            "stock",
            "data should contain stock name"
          );
          assert.property(
            res.body.stockData,
            "price",
            "data should contain price of stock"
          );
          assert.property(
            res.body.stockData,
            "likes",
            "data should contain likes property"
          );
          assert.equal(
            res.body.stockData.likes,
            1,
            "likes should not be double-counted"
          );
          done(null, res);
        });
    });

    test("2 stocks", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["msft", "aapl"] })
        .end((err, res) => {
          if (err) return done(err);
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData, "stockData should be an array");
          assert.property(
            res.body.stockData[0],
            "stock",
            "data should contain stock name"
          );
          assert.property(
            res.body.stockData[0],
            "price",
            "data should contain price of stock"
          );
          assert.property(
            res.body.stockData[0],
            "rel_likes",
            "data should contain like difference"
          );
          assert.property(
            res.body.stockData[1],
            "stock",
            "data should contain stock name"
          );
          assert.property(
            res.body.stockData[1],
            "price",
            "data should contain price of stock"
          );
          assert.property(
            res.body.stockData[1],
            "rel_likes",
            "data should contain like difference"
          );
          done(null, res);
        });
    });

    test("2 stocks with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["msft", "goog"], like: "true" })
        .end((err, res) => {
          if (err) return done(err);
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData, "stockData should be an array");
          assert.property(
            res.body.stockData[0],
            "stock",
            "data should contain stock name"
          );
          assert.property(
            res.body.stockData[0],
            "price",
            "data should contain price of stock"
          );
          assert.property(
            res.body.stockData[0],
            "rel_likes",
            "data should contain like difference"
          );
          assert.property(
            res.body.stockData[1],
            "stock",
            "data should contain stock name"
          );
          assert.property(
            res.body.stockData[1],
            "price",
            "data should contain price of stock"
          );
          assert.property(
            res.body.stockData[1],
            "rel_likes",
            "data should contain like difference"
          );
          done(null, res);
        });
    });
  });
});
