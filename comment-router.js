module.exports = function(app)
{
    var commentCtr = require('./comment-ctr');
    app.route('/api/comments/:post_id').get(commentCtr.getCommentByPost);
    app.route('/api/comments').post(commentCtr.sendComment);
    app.route('/api/comments/:comment_id').delete(commentCtr.deleteComment);
    app.route('/api/comments/:comment_id').patch(commentCtr.updateComment);
}