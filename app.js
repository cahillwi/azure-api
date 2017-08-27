var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    getcount_sl = require('./getcount_sl');

var db = mongoose.connect('mongodb://localhost/tickerAPI',{useMongoClient: true});

var Ticker = require('./models/tickerModel');


var app = express();
var port = process.env.port || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

ticker_router = require('./Routes/tickerRoutes')(Ticker);


app.use('/api', ticker_router);



app.get('/', function(req, res){
    res.send('Welcome to my API!');
});

app.listen(port, function(){
    console.log('Gulp is running my app on Port: ' + port);
});
getcount_sl();
setInterval(getcount_sl, 1800000);