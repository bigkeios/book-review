window.onload = function()
{
    var readMore = document.getElementById('readMore');
    var postID = document.getElementsByClassName('post').item(0).getAttribute('id');
    readMore.addEventListener('click', loadAPost);
    function loadAPost()
    {
        window.location.href = 'post-view-index.html';
    }
    export{postID};
}
