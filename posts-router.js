// the module when use: name(app)
module.exports = function(app)
{
    var postsCtr = require('./posts-ctr');
    app.use(function(req, res, next)
    {
        res.header('Access-Control-Allow-Origin:', 'http://localhost:8000/*');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.route('/posts').get(postsCtr.listAllPosts);
}