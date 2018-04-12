module.exports = function(app)
{
    var tagCtr = require('./tag-ctr');
    app.route('/api/tags').get(tagCtr.getAllTags);
    app.route('/api/create-tag').post(tagCtr.createNewTag);
    app.route('/api/has-tag').post(tagCtr.saveRelaWPost);
    app.route('/api/tags/:post_id').get(tagCtr.getTagByPost);
}