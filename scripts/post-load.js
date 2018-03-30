window.onload = function()
{
    var post = document.getElementsByClassName('post');
    var url = window.location.href;
    var urlSplitted = url.split('/')
    var postID = urlSplitted[4];
    let promise = new Promise(function(resolve, reject)
    {
        var requestPost = new XMLHttpRequest();
        // request.open('GET', '../static data/posts.json', true);
        requestPost.open('GET', 'http://localhost:8000/api/posts/' + postID);
        requestPost.onload = function () 
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
        requestPost.send();    
    });
    var requestCateg = new XMLHttpRequest();
    requestCateg.open('GET','http://localhost:8000/api/categs/'+postID);
    requestCateg.onload = function()
    {
        var categs = JSON.parse(this.response);
        var categsDetails = document.createElement('p');
        categsDetails.textContent = 'Categories: ';
        for(var categ of categs)
        {
            console.log(categ);
            categsDetails.textContent += categ.name + '';
        }
        post.item(0).appendChild(categsDetails);
    }
    requestCateg.send();
}
