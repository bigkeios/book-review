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
    }
}