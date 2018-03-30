var connection = require('./connection');
var bopyParser = require('body-parser');
module.exports = 
{
    listAllCategs: function(req, res)
    {
        let promise = new Promise(function(resolve, reject)
        {
            connection.query('SELECT * FROM category', function(err, rows, fields)
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
    }
}