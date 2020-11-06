const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');
require('dotenv').config()

const PORT = process.env.PORT || 5000;

//user body parser middleware
app.use(bodyParser.urlencoded({extended: false}));


function call_api(finishedAPI, ticker){
    request('https://cloud.iexapis.com/stable/stock/'+ ticker + '/quote?token=' + process.env.API_KEY, {json: true}, (err, res, body) => {
        if(err){return console.log(err);}
        if(res.statusCode === 200){
            finishedAPI(body)
        }
    });
}


//Set Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Set handlebar index GET route
app.get('/', function (req, res) {
    call_api(function(doneAPI){
        
        res.render('home', {stock: doneAPI});

    }, "goog"); //search for google
});

//Set handlebar index POST route
app.post('/', function (req, res) {
    call_api(function (doneAPI) {
        //posted_stuff = req.body.stock_ticker;
        res.render('home', { 
            stock: doneAPI,
        });
    }, req.body.stock_ticker);
});


app.get('/about.html', function (req, res) {
    res.render('about');
});

//set static folder
app.use(express.static(path.join(__dirname, 'public')));


app.listen(PORT, ()=> console.log('Server Listening on Port ' +  PORT));

