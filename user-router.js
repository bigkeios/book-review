module.exports = function(app, express, Passport, LocalStrategy)
{
    app.use(function(req, res, next)
    {
        // XHR request obeys the CORS, must add head so that the API will accept access from the web
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    // specify the root for all the files used
    app.use(express.static(__dirname));
    var userCtr = require('./user-ctr');
    var connection = require('./connection');
    app.set('views', __dirname+'/views');
    // using ejs as the view renderer for html
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');
    app.get('/users/home', function(req, res)
    {
        res.send('Logged in');
    });
    app.get('/users/private', function (req, res) 
    {
       if(req.isAuthenticated())
       {
            res.send('Welcome');
       } 
       else
       {
           res.send('You are not logged in');
       }
    });
    app.route('/users/signup').post(userCtr.signUp);
    app.route('/users/login').post(Passport.authenticate('local'));
    Passport.use(new LocalStrategy
        (
            function(username, password, done)
            {
                // search for user with entered credentials
                connection.query('SELECT * FROM users WHERE name=? AND password=?', [username, password], function(err, rows, fields)
                {
                    console.log(this.sql);
                    if(err)
                    {
                        return done(err); 
                    }
                    else
                    {
                        if(rows.size == 0 )
                        {
                            return done(null, false)
                        }
                        else
                        {
                            // req.session.userID = rows[0].idusers;
                            // req.session.user = rows[0];
                            return done(null, rows[0]);
                        }
                    }
                });
            }
    ));
    Passport.serializeUser(function(user, done)
    {
        console.log(user);
        done(null, user.idusers);
    });
    Passport.deserializeUser(function(idusers, done)
    {
        // search for user with given id (from serializeUser)
        connection.query('SELECT * FROM users WHERE idusers=?', idusers, function(err, rows, fields)
        {
            console.log(this.sql);
            if(err)
            {
                return done(err);
            }
            else
            {
                if(rows.size == 0)
                {
                    return done(null,false);
                }
                else
                {
                    return done(null, rows[0]);
                }
            }
        });
    });
}