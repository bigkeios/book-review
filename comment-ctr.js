var connection = require('./connection');
module.exports = 
{
    getCmtByPostId: function(req, res)
    {
        let promise = new Promise(function(resolve, reject)
        {
            connection.query('SELECT * FROM comment JOIN users WHERE idposts=? and comment.posts_idusers=users.idusers',[req.params.post_id], function(err, rows, fields)
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
        })
    },
    sendCmt: function(req, res)
    {
        let promise = new Promise(function(resolve, reject)
        {
            req.app.use(bodyParser.json());
            var cmt = req.body;
            connection.query('INSERT INTO comment SET content=?, dateCreated=?, dateModified=?, iduser=?, idposts=?, posts_idusers=?', [req.params.content], [req.params.dateCreated], [req.params.dateModified], [req.params.iduser], [req.params.idposts], [req.params.posts_idusers], function(err,rows, fields)
            {
                if(err)
                {
                    return reject(new Error('Error querying'));
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