var express = require('express');
var bodyParser = require('body-parser');
var postsRouters = require('./posts-router');
var categRouters = require('./categ-router');
var commentRouters = require('./comment-router');
// start an express app
var app = express();
app.use(bodyParser.json());
// postsRouters(app, express);
// categRouters(app);
commentRouters(app);
app.listen(8000);