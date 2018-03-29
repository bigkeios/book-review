var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./posts-router');
// start an express app
var app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
routes(app, express);
app.listen(8000);