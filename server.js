var express = require('express');
var bodyParser = require('body-parser');
var postsRouters = require('./posts-router');
var categRouters = require('./categ-router');
var commentRouters = require('./comment-router');
var tagRouters = require('./tag-router');
// start an express app
var app = express();
app.use(bodyParser.json());
postsRouters(app, express);
categRouters(app);
commentRouters(app);
tagRouters(app);
app.listen(8000);