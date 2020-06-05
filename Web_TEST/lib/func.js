var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet')
app.use(helmet());
app.use(helmet.xssFilter());
app.disable("x-powered-by");
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var flash = require('connect-flash');
var db = require('./lib/db');


exports.read_log = function (request,response){

}