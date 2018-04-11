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
    saveRelaWPost: function(req, res)
    {
        req.app.use(bodyParser.json());
        var hasTagInfo = req.body;
        console.log();
        connection.query('INSERT INTO posts_has_tag SET idposts = ?, posts_idusers = ?, idtag = ?', [hasTagInfo.idposts, hasTagInfo.posts_idusers, hasTagInfo.idtag], function(err, rows, fields)
        {
            console.log(this.sql);
           if(err)
           {
                res.send(err);
           } 
           else
           {
                res.send(hasTagInfo);
           }
        });
    }
}