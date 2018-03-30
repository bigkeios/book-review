window.onload = function()
{
    var post = document.getElementsByClassName('post');
    var url = window.location.href;
    var urlSplitted = url.split('/')
    var postID = urlSplitted[4];
    var request = new XMLHttpRequest();
    // request.open('GET', '../static data/posts.json', true);
    request.open('GET', 'http://localhost:8000/api/posts/' + postID);
    request.onload = function () 
    {
        var jsonData = JSON.parse(this.response);
        populatePost(jsonData[0]);
    }
    function populatePost(data)
    {
        post.item(0).setAttribute('id',data.idposts + '');
        // elements in the post body
        var postTitle = document.createElement('h3');
        var detail = document.createElement('h4');
        var postContent = document.createElement('p');
        postTitle.textContent = data.title;
        post.item(0).appendChild(postTitle);
        var dateCreated = new Date(data.dateCreated);
        detail.textContent = 'Posted on ' + dateCreated.toDateString();
        post.item(0).appendChild(detail);
        postContent.textContent = data.content;
        post.item(0).appendChild(postContent);
    }
    request.send();
}
