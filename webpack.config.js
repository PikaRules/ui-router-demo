const devConfig = require('./webpack.config/dev.js');
const prodConfig = require('./webpack.config/prod.js');
const sandConfig = require('./webpack.config/sand.js');

module.exports = function() {

    if ( process.env.BUILD_ENV === "production" ) {
        return prodConfig();
    } else if ( process.env.BUILD_ENV === "sandbox" ) {
        return sandConfig();
    } else {
        return devConfig();
    }

}();
