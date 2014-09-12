'use strict';

var config = require('../config-manager');

var express = require('express');
var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

var events = require('events');
var request = require('request');

var userModel = require('./models/users');

var router = express.Router();

var users = [];





// Create a class that we can use to emit events
function Security() {
    events.EventEmitter.call(this);
}
 
Security.prototype.__proto__ = events.EventEmitter.prototype;



// Replace the modules object with this one, so it can emit events
var security = module.exports = new Security();

// Passport session setup
passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    var user = users.filter(function(user) {
        return user.username == username;
    })[0];
    if (user === undefined) {
        done(new Error('No user with username "' + username + '" found.'));
    } else {
        done(null, user);
    }
});


// Create a strategy for login trough our own API
passport.use(new LocalStrategy(

    function(username, password, done) {

        userModel.find(username, password).then(function(user) {

            var exists = _.any(users, function (user) {
                return user.username == username;
            });
            
            if (!exists) {
                users.push(user);
            }

            return done(null, user);
 
        }).catch(function(err) {
            done(err);
        });

    }

));

router.get('/login', function (req, res) {
    res.render('login', { hideLogin: true, user:req.user, message:req.flash('error') });
});

router.post('/login', function(req, res, next) {

    passport.authenticate('local', function(err, user, info) {

        if (err) { 
            return next(err); 
        }

        if (!user) { 
            req.flash('error', 'Invalid username or passport!');
            return res.redirect('/login');
        }

        if (!user.properties) { 
            req.flash('error', 'Error in login process. Please try again later!');
            return res.redirect('/login');
        }


        if (req.origin != user.properties.origin.value) {
            req.flash('error', 'Wrong origin!');
            return res.redirect('/login');
        }

        req.logIn(user, function(err) {

            if (err) { 
                return next(err); 
            }

            // Emit an event each time a user logs in
            security.emit('login', user);

            // Save the user id in a session
            // We do this so that we can connect a websocket with a user ID for the realtime services
            req.session.userId = user.user_id;

            return res.redirect('/feed');
        });

    })(req, res, next);

}); 

// Simple route middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function decorateResponseWithUserInfo(req, res, next) {
    if (req.user) {
        res.locals.user = req.user;
    }
    next();
};

function init(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(decorateResponseWithUserInfo);
    app.use('/', router);
}

// We expose this function since its the one that makes sure a resource can be private
Security.prototype.ensureAuthenticated = ensureAuthenticated;

// This is used to initiate the security
Security.prototype.init = init;



