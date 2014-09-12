var passport = require('passport');
var config = require('../config-manager');

var express = require('express');

var session = require('express-session');
var CookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var connect = require('connect');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var path = require('path');

var routes = require('./routes');
var security = require('./security');
//var analyze = require('./analyze');
var realtime = require('./realtime');

// So we can have a session connected both to the normal request/response and the websocket.
var cookieParser = CookieParser(config.server.sessionSecret);
var sessionStore = new connect.middleware.session.MemoryStore();

var SessionSockets = require('session.socket.io');
var sessionSockets = new SessionSockets(io, sessionStore, cookieParser);

realtime.init(sessionSockets, io);

// view engine setup

app.set("views", path.join(__dirname, "../views"));
app.engine("dot", require("dot-emc").init({app: app, fileExtension:"dot", options:{templateSettings:{cache:false}} }).__express);

app.set("view engine", "dot");


app.use(express.static(path.join(__dirname, '../public')));

app.use(cookieParser);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(methodOverride());
app.use(session({
    secret: config.server.sessionSecret, 
    saveUninitialized: true,
    resave: true,
    store: sessionStore
})); 

// Connect the security
security.init(app);


// Start both http and zmq socket server
exports.start = function(done) {

    if (typeof done != "function") {
        done = function() {};
    }

    // Load all endpoints
    var routes = require('./routes');
    for(var i = 0, ii = routes.length; i < ii; i++){ 
        app.use('/', routes[i]);
    };

    server.listen(config.server.port, function(err) {

        if (err) return done(err);

        //realtime.start().then(done).fail(done);

    });

}

// Close the servers, both the http and the zmq socket server
exports.stop = function(done) {

    if (typeof done != "function") {
        done = function() {};
    }

    server.close(function(err) {
        if (err) return done(err);
        realtime.close();
        done();
    });

}

