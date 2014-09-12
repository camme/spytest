var Q = require('q');

var users = [];

users.push({ username: 'camme', password: 77 });
users.push({ username: 'jens', password: 77 });
users.push({ username: 'faddi', password: 77 });

exports.find = function(user, pass) {
    
    var promise = Q.fcall(function() {
        
        var usersOk = users.filter(function(user) {
            return user.name == user && user.password == pass;
        });

        return userOk[0];

    });

    return promise;

}
