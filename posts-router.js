// the module when use: name(app)
module.exports = function(app, express)
{
    var postsCtr = require('./posts-ctr');
    app.use(function(req, res, next)
    {
        // XHR request obeys the CORS, must add head so that the API will accept access from the web
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
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
        res.render('home-view-index.ejs');     
    });
    app.get('/home-view-index.html', function(req, res)
    {
        res.render('home-view-index.ejs');     
    });
    // each post route
    app.get('/post-view-index/:post_id', function(req, res)
    {
        res.render('post-view-index.ejs');     
    });
    // about page route
    app.get('/about-view.html', function(req, res)
    {
        res.render('about-view.ejs');     
    });
    // Log in page route
    app.get('/log-in-view-index.html', function(req, res)
    {
        res.render('log-in-view-index.ejs');     
    });
    // Sign-up page route
    app.get('/sign-up-view-index.html', function(req, res)
    {
        res.render('sign-up-view-index.ejs');     
    });
    // Composing post page route
    app.get('/compose-post-index.html', function(req, res)
    {
        res.render('compose-post-index.ejs');     
    });
    // Edit post page route
    app.get('/edit-post-index/:post_id', function(req, res)
    {
        res.render('edit-post-index.ejs');
    });
    // Posts by categs page route
    app.get('/categories/:categ_id', function(req, res)
    {
        res.render('home-view-index.ejs');
    });
    // Posts by tags page route
    app.get('/tags/:tag_id', function(req, res)
    {
       res.render('home-view-index.ejs'); 
    });
    // Posts by time page route
    app.get('/time/:time', function(req, res)
    {
        res.render('home-view-index.ejs');
    });
    // API ROUTES
    // routes for posts
    app.route('/api/posts').get(postsCtr.listAllPosts);
    app.route('/api/posts').post(postsCtr.sendPost);
    app.route('/api/posts/:post_id').get(postsCtr.getPostById);
    app.route('/api/posts/:post_id').delete(postsCtr.deleteAPost);
    app.route('/api/posts/:post_id').patch(postsCtr.updatePost);
    app.route('/api/posts/archives/time').get(postsCtr.getAllArchivesTime);
    app.route('/api/posts/archives/categories/:categ_id').get(postsCtr.getPostsByCateg);
    app.route('/api/posts/archives/tags/:tag_id').get(postsCtr.getPostsByTag)
    app.route('/api/posts/archives/time/:time').get(postsCtr.getPostByDateCreated);
    // routes for categs in relation with posts
    app.route('/api/posts/:post_id/categories').get(postsCtr.getCategsOfPost);
    app.route('/api/posts/:post_id/categories/:categ_id/').post(postsCtr.saveRelationWCateg);
    app.route('/api/posts/:post_id/categories').delete(postsCtr.deleteRelationWCateg);
    // routes for comments in relation with posts
    app.route('api/posts/:post_id/comments').delete(postsCtr.deleteCommentsByPost);
    // routes for tags in relation with posts
    app.route('/api/tags/:post_id/tags').get(postsCtr.getTagsOfPost);
    app.route('/api/posts/:post_id/tags/:tag_id').post(postsCtr.saveRelationWTag);
    app.route('/api/posts/:post_id/tags').delete(postsCtr.deleteRelationWTag)
}
