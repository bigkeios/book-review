module.exports = function(app)
{
    var commentCtr = require('./comment-ctr');
    app.route('/api/comments/:post_id').get(commentCtr.getCommentByPost);
    app.route('/api/send-comment').post(commentCtr.sendComment);
    app.route('/api/delete-comment/:comment_id').delete(commentCtr.deleteCommentsOfPost);
}