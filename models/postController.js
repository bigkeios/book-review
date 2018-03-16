var connection = require('../connect-db');
var server = require('../server');
app.get('/posts/', function(req, res)
{
    connection.query('SELECT * FROM post', function(err, rows, fields)
    {
       if(err)
       {
           console.log(res.json({'Error': true, 'Message': 'Error execute query'}));
       }
       else
       {
           console.log(res.json({'Error': false, 'Messages': 'Success', "Posts": rows}));
       }
    });
});
// function getPost()
// {
//     this.get = function(res)
//     {
//         connection.acquire(function(err, con)
//         {
//            con.query('SELECT * FROM post', function(err, result)
//             {
//                res.send(result);
//                con.release(); 
//             }); 
//         });
//     };
// }
// module.exports = new getPost();
