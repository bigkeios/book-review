var posts = document.getElementsByClassName('posts');
var request = new XMLHttpRequest();
request.open('GET', 'http://localhost:8000/posts/', true);
// request.onreadystatechange = handler;
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
        var postTitle = document.createElement('h3');
        var detail = document.createElement('h4');
        var postContent = document.createElement('p');
        var readMore = document.createElement('a');
        //putting data into newly created elements
        postTitle.textContent = jsonData[i].title;
        postContent.textContent = jsonData[i].content[0];
        // var authorName = "";
        // jsonData[1].forEach(function(author, j)
        // {
        //     if(jsonData[0][i].createUserId == author[j].id)
        //         authorName = author[j].name;
        // })
        detail.textContent = 'Posted on ' + jsonData[i].dateCreated; 
        readMore.textContent = 'Read More...';
        readMore.setAttribute('href', '#');
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
