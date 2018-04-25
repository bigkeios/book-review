var connection = require('./connection');
var bodyParser = require('body-parser');
module.exports = 
{
    getAllTags: function(req, res)
    {
        let promise = new Promise(function(resolve, reject)
        {
            connection.query('SELECT * FROM tag', function(err, rows, fields)
            {
                if(err)
                {
                    return reject(err);
                }  
                else
                {
                    return resolve(rows);
                }
            })
        });
        promise.then(function(msgSuccess)
        {
            res.send(msgSuccess);  
        }, function(msgFail)
        {
            res.send(msgFail);  
        })
    },
    createNewTag: function(req, res)
    {
        req.app.use(bodyParser.json());
        var tag = req.body;
        connection.query('SELECT idtag, COUNT(*) as count FROM tag WHERE name = ?', [tag.name], function(err, rows, fields)
        {
            if(err)
            {
                res.send(err);
            }
            else
            {
                // if the tag has not existed, create a new tag
                if(rows[0].count == 0 )
                {
                    connection.query('INSERT INTO tag SET name=?',[tag.name], function(err, rows, fields)
                    {
                        console.log(this.sql);
                        if(err)
                        {
                            res.send(err);
                        }
                        else
                        {
                            res.send(rows);
                        }
                    });
                }
                // else send back the id of the tag in the db
                else if(rows[0].count > 0)
                {
                    res.send(rows[0]);
                }
            }
        });
    },
    getTagByID: function(req, res)
    {
        connection.query('SELECT name FROM tag WHERE idtag=?', [req.params.tag_id], function(err, rows, fields)
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
    deleteARela: function(req, res)
    {
        req.app.use(bodyParser.json());
        var request = req.body;
        connection.query('DELETE FROM posts_has_tag, tag USING posts_has_tag NATURAL JOIN tag WHERE posts_has_tag.idposts=? AND tag.name=?', [request.idposts, request.name], function(err, rows, fields)
        {
            console.log(this.sql);
            if(err)
            {
                res.send(err);
            }
            else
            {
                res.send(rows);
            }
        });
    }
}