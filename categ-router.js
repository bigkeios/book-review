module.exports = function(app)
{
    var categCtr = require('./categ-ctr');
    app.route('/api/categs').get(categCtr.listAllCategs);
    app.route('/api/has-categ').delete(categCtr.deleteARela);
    app.route('/api/categs/:categ_id').get(categCtr.getCategByID);
}