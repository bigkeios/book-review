module.exports = function(app)
{
    var commentCtr = require('./comment-ctr');
    app.route('/api/comments/:post_id').get(commentCtr.getCommentByPost);
    app.route('/api/send-comment').post(commentCtr.sendComment);
}