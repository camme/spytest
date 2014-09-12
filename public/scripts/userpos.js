require(['components/domReady!', 'socket', 'map'], function(_, socket, map) {


function init() {

    map.init();

        var geoDom = document.querySelector("#geo-coordinate");
        var noGeo = document.querySelector("#no-geo");

        function useGeo(position) {

            clearTimeout(checkGeo);
            socket.emit("user.position", position);

            map.positionUser("me", "#ff00ff", position.coords);

            setTimeout(function() {
                navigator.geolocation.getCurrentPosition(useGeo);
            }, 200);

        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(useGeo);
            checkGeo = setTimeout(function() {
                //noGeo.classList.add("show");
            }, 4000);
        } else {
            geoDom.innerHTML = "Geolocation is not supported by this browser.";
            noGeo.classList.add("show");
        }

    }


    init();

    socket.on('users.update', function(e) {
        map.positionUser(e.userId, e.color, e.position);
    });

});
  
