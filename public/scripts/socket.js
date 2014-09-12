define(['/socket.io/socket.io.js'], function(io) {

    var socket = io.connect(location.protocol + '//' + location.hostname);

    return socket;

});
