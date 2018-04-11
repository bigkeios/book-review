var connection = require('./connection');
var bodyParser = require('body-parser');
module.exports = 
{
    listAllCategs: function(req, res)
    {
        let promise = new Promise(function(resolve, reject)
        {
            connection.query('SELECT * FROM category ORDER BY name ASC', function(err, rows, fields)
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
    },
    saveRelaWPost: function(req, res)
    {
        let promise = new Promise(function(resolve, reject)
        {
            req.app.use(bodyParser.json());
            var hasCateg = req.body; 
            connection.query('INSERT INTO posts_has_category SET idposts = ?, posts_idusers = ?, idCategory = ?', [hasCateg.idposts, hasCateg.posts_idusers, hasCateg.idCategory], function(err, rows, fields)
            {
                console.log(this.sql);
               if(err)
               {
                   return reject(err);
               } 
               else
               {
                   return resolve(hasCateg);
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