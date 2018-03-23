// the module when use: name(app)
module.exports = function(app)
{
    var postsCtr = require('./posts-ctr');
    app.use(function(req, res, next)
    {
        // XHR request obeys the CORS, must add head so that the API will accept access from the web
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.route('/posts').get(postsCtr.listAllPosts);
    app.route('/compose-post').post(postsCtr.sendPost);
}