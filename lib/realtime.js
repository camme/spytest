//var userEvents = require('./user-events');

var security = require('./security');
var config = require('../config-manager');
var sessionSockets, io;
var uuid = require('node-uuid');

security.on('login', function(user) {
    socket.subscribe('user-' + user.user_id);
});



//socket.connect(config.glue.messageServer.url);

var userSocketConnection = {};

var colors = ['red', 'blue', 'green', 'yellow', 'grey', 'orange'];

var users = {};

exports.init = function(sessionSocketsRef, io) {

    sessionSockets = sessionSocketsRef;

    sessionSockets.on('connection', function (err, socket, session) {

        if (session && session.userId) {
            userSocketConnection[session.userId] = {
                start: new Date(),
                //socket: socket
            }
        }
		
	users[socket.id] = {
		id: uuid.v4().substring(0, 5),
		color: colors[Math.round(Math.random() * (colors.length - 1))]
};

	socket.join('spygame-pos');

    socket.on('user.position', function(e) {

	var id = users[socket.id].id;
	var color = users[socket.id].color;

        io.in('spygame-pos').emit('users.update', {
            userId: id,
            color: color,
            position: e.coords
        });

    });


    });

}


