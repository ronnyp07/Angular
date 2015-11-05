process.env.NODE_ENV = process.env.NODE_ENV || 'develoment';

var mongoose = require("./config/mongoose"),
    express = require("./config/express"),
    passport = require("./config/passport");


var  db = mongoose();
var app = express();
var passport = passport();


app.listen(process.env.PORT || 3000);
module.exports = app;
console.log("server is up");