var connection = require('./connection');
var bodyParser = require('body-parser');
module.exports = 
{
    logIn: function(req,res)
    {
        req.app.use(bodyParser.json());
        var loginInfo = req.body;
        connection.query('SELECT * FROM users WHERE name=? AND password=?', [loginInfo.username, loginInfo.password], function(err, rows, fields)
        {
            console.log(this.sql);
            if(err)
            {
                res.send(err);
            }
            else
            {
                if(rows.size == 0 )
                {
                    res.send('Invalid login information');
                }
                else
                {
                    req.session.userID = rows[0].idusers;
                    req.session.user = rows[0];
                    res.send("Logged in");
                }
            }
        });
    },
    signUp: function(req, res)
    {

    }
}