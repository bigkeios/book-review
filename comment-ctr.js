var connection = require('./connection');
var bodyParser = require('body-parser');
module.exports = 
{
    getCommentByPost: function(req, res)
    {
        let promise = new Promise(function(resolve, reject)
        {
            var postID = [req.params.post_id];
           connection.query('SELECT comment.idcomment, comment.content, users.name FROM comment NATURAL JOIN users WHERE comment.idposts = ?', [postID], function(err, rows, fields)
            {
                console.log(this.sql);
               if(err)
               {
                    return reject(err);
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
    sendComment: function(req, res)
    {
        let promise = new Promise(function(resolve, reject)
        {
            req.app.use(bodyParser.json());
            var cmt = req.body;
            connection.query('INSERT INTO comment SET content = ?, dateCreated = ?, dateModified = ?, idusers = ?, idposts = ?, posts_idusers = ?', [cmt.content, cmt.dateCreated, cmt.dateModified, cmt.idusers, cmt.idposts, cmt.posts_idusers], function(err, rows, fields)
            {
                console.log(this.sql);
                if(err)
                {
                    return reject(err);
                }
                else
                {
                    return resolve(cmt);
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