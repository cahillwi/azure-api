var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var tickerModel = new Schema({
    updated: {type: String},
    count: {type: Number}
});

module.exports = mongoose.model('Ticker', tickerModel);