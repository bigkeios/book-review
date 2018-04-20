var connection = require('./connection');
var bodyParser = require('body-parser');
var jsonPatch = require('jsonpatch');
module.exports = 
{
    getCommentByPost: function(req, res)
    {
        let promise = new Promise(function(resolve, reject)
        {
            var postID = [req.params.post_id];
           connection.query('SELECT comment.idcomment, comment.content, users.name, comment.dateCreated FROM comment NATURAL JOIN users WHERE comment.idposts = ?', [postID], function(err, rows, fields)
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
    },
    deleteComment: function(req,res)
    {
        connection.query('DELETE FROM comment WHERE idcomment=?',[req.params.comment_id], function(err, rows, fields)
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
    },
    updateComment: function(req, res)
    {
        req.app.use(bodyParser.json());
        var patches = req.body;
        connection.query('SELECT * FROM comment WHERE idcomment=?', [req.params.comment_id], function(err, rows, fields)
        {
            console.log(this.sql);
            if(err)
            {
                res.send(err);
            }
            else
            {
                var comment = rows[0];
                comment = jsonPatch.apply_patch(comment, patches);
                connection.query('UPDATE comment SET content = ?, dateModified = ? WHERE idcomment=?', [comment.content, comment.dateModified, comment.idcomment], function(err, rows, fields)
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
        });
    }
}