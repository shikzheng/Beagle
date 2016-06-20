
var mime = require('mime'),
    path = require('path');

module.exports = function(app, defaultType) {
    return function(env, callback) {
        var extname, format, pathInfo;
        pathInfo     = env.pathInfo;
        extname      = path.extname(pathInfo);
        format       = extname ? mime.lookup(extname) : null;
        env.format   = format;

        // Modify env.pathInfo for downstream apps
        if (extname) {
            env.pathInfo = pathInfo.replace(new RegExp("" + extname + "$"), "");
        }


        return app(env, function(status, headers, body) {
            // Reset env.pathInfo for upstream apps.
            env.pathInfo = pathInfo;

            return callback(status, headers, body);
        });
    };
};