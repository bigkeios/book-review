window.onload = function()
    {
        import postID from './post-direct-single-page';
        var request = new XMLHttpRequest();
        // request.open('GET', '../static data/posts.json', true);
        request.open('GET', 'http://localhost:8000/posts/' + postID + '');
        request.onload = function () 
        {
            var jsonData = JSON.parse(this.response);
            var post = document.getElementsByClassName('post');
            post.item(0).setAttribute('id',jsonData.id);
            // attributes of the post body
            var postTitle = document.createElement('h3');
            var detail = document.createElement('h4');
            var postContent = document.createElement('p');
            postTitle.textContent = jsonData.title;
            post.item(0).appendChild(postTitle);
            var dateCreated = new Date(jsonData.dateCreated);
            detail.textContent = 'Posted on ' + dateCreated.toDateString();
            post.item(0).appendChild(detail);
            postContent.textContent = jsonData.content;
            post.item(0).appendChild(postContent);
        }
        request.send();
    }