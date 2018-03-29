var posts = document.getElementsByClassName('posts');
var request = new XMLHttpRequest();
request.open('GET', 'http://localhost:8000/api/posts/');
request.onload = function()
{
    var data = JSON.parse(this.response);
    populatePost(data);
}
function populatePost(jsonData)
{
    for(var i = 0; i < jsonData.length; ++i)
    {
        // creating div to store a post with its attributes
        var post = document.createElement('div');
        post.setAttribute('class', 'post');
        post.setAttribute('id', jsonData[i].idposts + '');
        var postTitle = document.createElement('h3');
        var detail = document.createElement('h4');
        var postContent = document.createElement('p');
        var readMore = document.createElement('a');
        //putting data into newly created elements
        postTitle.textContent = jsonData[i].title;
        // limit 100 characters to show only preview
        for(var j=0; j < 100; ++j)
        {
            postContent.textContent += jsonData[i].content[j];
        }
        postContent.textContent += "...";
        var dateCreated = new Date(jsonData[i].dateCreated);
        // toDateString returns on date, not specific time
        detail.textContent = 'Posted on ' + dateCreated.toDateString();
        readMore.textContent = 'Read More...';
        readMore.setAttribute('id', 'readMore');
        readMore.setAttribute('href', './post-view-index.html');
        //append the new elements into the document (posts div to be specific)
        // posts is obtained from getElementByClassName so it is a HTMLCollection -> access first elements through item()
        posts.item(0).appendChild(post);
        post.appendChild(postTitle);
        post.appendChild(document.createElement('hr'));
        post.appendChild(detail);
        post.appendChild(postContent);
        post.appendChild(readMore);
    }
}
request.send();
