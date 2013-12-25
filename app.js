/*NODE JS modules*/
var express = require('express');
var ejs = require('ejs');
var app = express();
var server = require('http').createServer(app);

/*CUSTOM modules*/
var rek = require('rekuire');
var routes = rek('routes.js');


/*setup ejs with views folder*/
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(function (req, res, next) {
    res.template = new Object();
    next();
});

app.use(express.cookieParser('smashbros12'));
app.use(express.cookieSession());

//app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());

app.use(app.router);


/*static requests*/
app.get('/public/*', function(req, res, next){
    express.static(__dirname)(req, res, function(){next('route')});
});

routes.init(app);

server.listen(3003);

console.log("Started----------------------");
