var getPost = require('/models/getPosts');
module.exports = 
{
    configure: function(app)
    {
        app.get('/posts/', function(req, res)
        {
            getPost.get(res);
        });
    },
};