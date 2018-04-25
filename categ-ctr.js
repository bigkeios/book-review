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
    getCategByID: function(req, res)
    {
        connection.query('SELECT name FROM category WHERE idCategory=?', [req.params.categ_id], function(err, rows, fields)
        {
            if(err)
            {
                res.send(err);
            }
            else
            {
                res.send(rows);
            }
        });
    },
    deleteARela: function(req,res)
    {
        req.app.use(bodyParser.json());
        var relation = req.body;
        connection.query('DELETE FROM posts_has_category WHERE idCategory=? AND idposts=?', [relation.idCategory, relation.idposts], function(err, rows, fields)
        {
            console.log(this.sql);
            if(err)
            {
                res.send(err)
            }
            else
            {
                res.send(rows);
            }
        });
    }
}