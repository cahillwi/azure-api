var express = require('express');

var routes = function(Ticker){
    var ticker_router = express.Router();
    
    ticker_router.route('/recentLogins')
        .post(function(req,res){
            var ticker = new Ticker(req.body);
            console.log(ticker);
            ticker.save();
            res.status(201).send(ticker);
        })
        .get(function(req, res){
            var query = {};
            if (req.query.count){
                query.count = req.query.count;
            }
            Ticker.find(query, function(err, tickers){
                if(err){
                    console.log(err);
                }else{
                    res.json(tickers);
                }
            });
        });
    ticker_router.route('/lastLogin')
        .get(function(req, res){
            var query = {}
            Ticker.findOne().sort('-updated').exec(function(err, tickers){
                if(err){
                    console.log(err);
                }else{
                    res.json(tickers);
                }
            });
        });

    return ticker_router;
};

module.exports = routes;