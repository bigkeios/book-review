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
    createTag: function(req, res)
    {
        let promise = new Promise(function(resolve, reject)
        {
            req.app.use(bodyParser.json());
            connection.query('INSERT INTO tag set name=?', [req.body.name], function(err, rows, fields)
            {
                console.log(this.sql);
                if(err)
                {
                    return reject(err);
                }
                else
                {
                    return resolve(req.body);
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