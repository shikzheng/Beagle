var assert = require("assert"),
    vows = require("vows"),
    strata = require("./../lib"),
    mock = strata.mock,
    format = strata.format;

vows.describe("format").addBatch({
    "A format middleware": {
        topic: function () {
            var app = function (env, callback) {
                callback(200, {
                    "Content-Type": "text/plain",
                    "X-PathInfo": env.pathInfo,
                    "X-Format": env.format
                }, "");
            }

            app = format(app);

            return app;
        },
        "when /abc is requested": {
            topic: function (app) {
                mock.request("/abc", app, this.callback);
            },
            "should format properly": function (err, status, headers, body) {
                assert.equal(headers["X-Format"], null);
                assert.equal(headers["X-PathInfo"], "/abc");
            }
        },
        "when /abc.json is requested": {
            topic: function (app) {
                mock.request("/abc.json", app, this.callback);
            },
            "should format properly": function (err, status, headers, body) {
                assert.equal(headers["X-Format"], "application/json");
                assert.equal(headers["X-PathInfo"], "/abc");
            }
        },
        "when /abc.xml is requested": {
            topic: function (app) {
                mock.request("/abc.xml", app, this.callback);
            },
            "should format properly": function (err, status, headers, body) {
                assert.equal(headers["X-Format"], "application/xml");
                assert.equal(headers["X-PathInfo"], "/abc");
            }
        }
    }
}).export(module);