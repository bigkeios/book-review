module.exports = function(app)
{
    var categCtr = require('./categ-ctr');
    app.route('/api/categs').get(categCtr.listAllCategs);
}