//var userEvents = require('./user-events');

var security = require('./security');
var config = require('../config-manager');
var sessionSockets, io;

security.on('login', function(user) {
    socket.subscribe('user-' + user.user_id);
});



//socket.connect(config.glue.messageServer.url);

var userSocketConnection = {};

exports.init = function(sessionSocketsRef, io) {

    sessionSockets = sessionSocketsRef;

    sessionSockets.on('connection', function (err, socket, session) {

        console.log("TJENA");

        if (session && session.userId) {
            userSocketConnection[session.userId] = {
                start: new Date(),
                //socket: socket
            }
        }

socket.join('spygame-pos');

    socket.on('user.position', function(e) {

        io.in('spygame-pos').emit('users.update', {
            userId: e.id,
            color: 'blue',
            position: e.coords
        });

    });


    });

}


