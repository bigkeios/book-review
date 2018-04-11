var connection = require('./connection');
var bodyParser = require('body-parser');
module.exports = 
{
    listAllPosts: function(req, res)
    {
        // use promise to make sure the query is executed then the results will be returned
        let promise = new Promise(function(resolve, reject)
        {
            connection.query('SELECT * FROM posts', function(err, rows, fields)
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
            var query = connection.query('INSERT INTO posts SET title = ?, content = ?, dateCreated = ?, dateModified = ?, idusers = ?', [post.title, post.content, post.dateCreated, post.dateModified, post.idusers], function(err, rows, fields)
            {
                console.log(query.sql);
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
    getPostById: function(req, res)
    {
        let promise = new Promise(function(resolve, reject)
        {
           var query = connection.query('SELECT * FROM posts WHERE idposts = ?', [req.params.post_id], function(err, rows, fields)
            {
                console.log(query.sql);
               if(err)
               {
                   console.log('Error querying');
                   return reject(new Error('Error querying'));
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
    }
}