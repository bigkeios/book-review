var connection = require('./connection');
var bodyParser = require('body-parser');
var jsonPatch = require('jsonpatch');
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
    },
    deleteAPost: function(req, res)
    {
        connection.query('DELETE FROM posts WHERE idposts=?',[req.params.post_id], function(err, rows, fields)
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
    updatePost: function(req,res)
    {
        req.app.use(bodyParser.json());
        var patches = req.body;
        connection.query('SELECT * FROM posts WHERE idposts = ?', [req.params.post_id], function(err, rows, fields)
        {
            if(err)
            {
                res.send(err);
            }
            else
            {
                var patchedPost = rows[0];
                patchedPost = jsonPatch.apply_patch(patchedPost, patches);
                connection.query('UPDATE posts SET title=?, content=?, dateCreated=?, dateModified=? WHERE idposts=?', [patchedPost.title, patchedPost.content, patchedPost.dateCreated, patchedPost.dateModified, patchedPost.idposts], function(err, rows, fields)
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
    },
    getCategsOfPost: function(req, res)
    {
        connection.query('SELECT category.name FROM posts_has_category natural join category WHERE posts_has_category.idposts=?;', [req.params.post_id], function(err, rows, fields)
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
    },
    saveRelationWCateg: function(req, res)
    {
        req.app.use(bodyParser.json());
        var hasCateg = req.body; 
        connection.query('INSERT INTO posts_has_category SET idposts = ?, posts_idusers = ?, idCategory = ?', [req.params.post_id, hasCateg.posts_idusers, req.params.categ_id], function(err, rows, fields)
        {
            console.log(this.sql);
            if(err)
            {
                res.send(err)
            } 
            else
            {
                res.send(rows)
            }
        }); 
    },
    deleteRelationWCateg: function(req, res)
    {
        connection.query('DELETE FROM posts_has_category WHERE idposts=?',[req.params.post_id],function(err, rows, fields)
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
    deleteCommentsByPost: function(req, res)
    {
        connection.query('DELETE FROM comment WHERE idposts=?', [req.params.post_id], function(err, rows, fields)
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
    getTagsOfPost: function(req, res)
    {
        connection.query('SELECT tag.name FROM tag NATURAL JOIN posts_has_tag WHERE idposts=?',[req.params.post_id], function(err, rows, fields)
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
    saveRelationWTag: function(req, res)
    {
        req.app.use(bodyParser.json());
        var hasTagInfo = req.body;
        console.log();
        connection.query('INSERT INTO posts_has_tag SET idposts = ?, posts_idusers = ?, idtag = ?', [req.params.post_id, hasTagInfo.posts_idusers, req.params.tag_id], function(err, rows, fields)
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
    },
    deleteRelationWTag: function(req, res)
    {
        connection.query('DELETE FROM posts_has_tag WHERE idposts=?', [req.params.post_id], function(err, rows, fields)
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