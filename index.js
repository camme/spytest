
var main = require('./lib/spygame');

if (require.main === module) { 
    main.start();
}
else { 
    module.exports = main;
}

