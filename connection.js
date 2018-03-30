// get the service of mysql
var mysql = require('mysql');
var connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'IchgsmPW8*',
        database: 'bookReviewBlogDB',
        multipleStatements: true,
    }
)
module.exports = connection;