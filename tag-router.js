module.exports = function(app)
{
    var tagCtr = require('./tag-ctr');
    app.route('/api/tags').get(tagCtr.getAllTags);
    app.route('/api/tags').post(tagCtr.createNewTag);
    app.route('/api/has-tag').delete(tagCtr.deleteARela);
    app.route('/api/tags/:tag_id').get(tagCtr.getTagByID);
}