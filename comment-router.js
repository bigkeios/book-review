module.exports = function(app)
{
    var cmtCtr = require('./comment-ctr');
    app.route('/api/comments/:post_id').get(cmtCtr.getCmtByPostId);
    app.route('/api/send-comment/').post(cmtCtr.sendCmt);
}