var connection = require('./connection');
var bodyParser = require('body-parser');
module.exports = {
    listAllPosts: function(req, res)
    {
        // use promise to make sure the query is executed then the results will be returned
        let promise = new Promise(function(resolve, reject)
        {
            connection.query('SELECT * FROM post', function(err, rows, fields)
            {
            if(err)
            {
                return reject(new Error('Error connecting'));
            }
            else
            {
                return resolve(rows);
            }
            }); 
        });
        promise.then(function(msgSuccess)
        {
            res.send(msgSuccess);
        }, function(msgFail)
        {
            res.send(msgFail);
        });
    },
    sendPost: function(req, res)
    {
        let promise = new Promise(function(resolve, reject)
        {
            // express requires body-parser to populate request body
            req.app.use(bodyParser.json());
            // if the body is not in the type specified, after option, head will not be returned
            var post = req.body;
            var query = connection.query('INSERT INTO post SET title = ?, content = ?, dateCreated = ?, dateModified = ?, categId = ?, user_id = ?', [post.title, post.content, post.dateCreated, post.dateModified, post.categId, post.user_id], function(err, rows, fields)
            {
                console.log(query.sql);
                if(err)
                {   
                    console.log('Error happened')
                    return reject(new Error('Error connecting'));
                }
                else
                {
                    return resolve(post);
                }
            });
        });
        promise.then(function(msgSuccess)
        {
            res.send(msgSuccess);  
        }, function(msgFail)
        {
            res.send(msgFail);
        }); 
    }
}