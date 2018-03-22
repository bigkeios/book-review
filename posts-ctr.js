var connection = require('./connection');
var bodyParser = require('body-parser');
exports.listAllPosts = function(req, res)
{
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
}
exports.sendPost = function(req, res)
{
    // express requires body-parser to populate request body
    req.app.use(bodyParser.json());
    var posts = req.body;
    let promise = new Promise(function(resolve, reject)
    {
        connection.query('INSERT INTO post VALUES ?', posts, function(err, rows, fields)
        {
            if(err)
            {
                return reject(new Error('Error connecting'));
            }
            else
            {
                return resolve(posts);
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