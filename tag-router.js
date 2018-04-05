module.exports = function(app)
{
    var tagCtr = require('./tag-ctr');
    app.route('/api/tags').get(tagCtr.getAllTags);
    app.route('/api/create-tag').post(tagCtr.createTag);
}