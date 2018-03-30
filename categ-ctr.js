var connection = require('./connection');
var bopyParser = require('body-parser');
module.exports = 
{
    listAllCategs: function(req, res)
    {
        let promise = new Promise(function(resolve, reject)
        {
            connection.query('SELECT * FROM category', function(err, rows, fields)
            {
                console.log(this.sql);
                if(err)
                {
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
    },
    listCategsByPostID: function(req, res)
    {
        let promise = new Promise(function(resolve, reject)
        {
            connection.query('SELECT category.name name FROM posts_has_category natural join category WHERE posts_has_category.idposts=?;', [req.params.post_id], function(err, rows, fields)
            {
                console.log(this.sql);
                if(err)
                {
                    console.log('Error querying');
                    return reject(new Error('Error query'));
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
        })
    }
}