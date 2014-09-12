define(['components/leaflet/leaflet'], function(leaflet) {

    var map;
    function init() {

        map = L.map('map').setView([52.5243700, 13.4105300], 16);

        L.tileLayer('http://{s}.tiles.mapbox.com/v3/camme.jg0nk6p7/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
        }).addTo(map);

    }

    var users = {};

    function positionUser(userId, color, coords) {

        var user = users[userId];
        if (!user) {
            user = users[userId] = {};
        }

        if (userId == "me") {
            map.setView([coords.latitude, coords.longitude], 18);
        }

        if (!user.dot) {
            var dot = L.circle([coords.latitude, coords.longitude], 5, {
                color: color,
                fillColor: color, 
                fillOpacity: 0.8
            }).addTo(map);
            user.dot = dot;
        } else {
            user.dot.setLatLng([coords.latitude, coords.longitude]);

        }

    }

    return {
        init: init,
        positionUser: positionUser
    };

});

