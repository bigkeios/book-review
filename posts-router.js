// the module when use: name(app)
module.exports = function(app, express)
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
    // specify the root for all the files used
    app.use(express.static(__dirname));
    app.set('views', __dirname+'/views');
    // using ejs as the view renderer for html
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');
    // home page route
    app.get('/', function(req, res)
    {
        res.render('home-view-index.html');     
    });
    app.get('/home-view-index.html', function(req, res)
    {
        res.render('home-view-index.html');     
    });
    // each post route
    app.get('/post-view-index/:post_id', function(req, res)
    {
        res.render('post-view-index.html');     
    });
    // about page route
    app.get('/about-view.html', function(req, res)
    {
        res.render('about-view.html');     
    });
    // Log in page route
    app.get('/log-in-view-index.html', function(req, res)
    {
        res.render('log-in-view-index.html');     
    });
    // Sign-up page route
    app.get('/sign-up-view-index.html', function(req, res)
    {
        res.render('sign-up-view-index.html');     
    });
    // Composing post page route
    app.get('/compose-post-index.html', function(req, res)
    {
        res.render('compose-post-index.html');     
    });
    // routes for APIs
    app.route('/api/posts').get(postsCtr.listAllPosts);
    app.route('/api/compose-post').post(postsCtr.sendPost);
    app.route('/api/posts/:post_id').get(postsCtr.getPostById);
    app.route('/api/compose-post/has-categ').post(postsCtr.recordPostCategRela);
}