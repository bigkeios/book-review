var connection = require('./connection');
exports.listAllPosts = function(req, res)
{
    let promise = new Promise(function(resolve, reject)
    {
        connection.query('SELECT * FROM post', function(err, rows, fields)
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
        res.send(msgSuccess);
    });
}
exports.postReview = function(req, res)
{
    var query = 'INSERT '
    connection.query()
}