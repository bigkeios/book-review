var passport = require('passport');
module.exports = function(app)
{
    app.use(function(req, res, next)
    {
        // XHR request obeys the CORS, must add head so that the API will accept access from the web
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    var userCtr = require('./user-ctr');
    app.route('/users/signup').post(userCtr.signUp);
    app.route('/users/login').post(userCtr.logIn);
}