//For routes, see in app/routes.js

var express = require('express');
var app = express(),
	config=require('./config'),
	bodyParser=require('body-parser');

var autho = require("node-autho");

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json()); // parse application/json 

var api=require('./app/routes')(app,express); //using the route.js file for routing
app.use('/api',api);

app.use(express.static(__dirname + '/public'));

app.get('*',function(req,res){
    res.sendFile(__dirname +'/public/index.html'); 
})

app.listen(config.port, function (err) {
	if(err){
    	console.log(err);
    }
    else{
    	console.log("listing on port 8000");
    }
});

exports = module.exports = app;