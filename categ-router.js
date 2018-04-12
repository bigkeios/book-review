module.exports = function(app)
{
    var categCtr = require('./categ-ctr');
    app.route('/api/categs').get(categCtr.listAllCategs);
    app.route('/api/categs/:post_id').get(categCtr.listCategsByPostID);
    app.route('/api/has-categ').post(categCtr.saveRelaWPost);
    app.route('/api/delete-relation-with-categ/:post_id').delete(categCtr.deleteRelaWPost);
}