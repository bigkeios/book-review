var express = require('express');
var bodyParser = require('body-parser');
var postsRouters = require('./posts-router');
var categRouters = require('./categ-router');
var cmtRouters = require('./comment-router');
// start an express app
var app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
postsRouters(app, express);
categRouters(app);
cmtRouters(app);
app.listen(8000);