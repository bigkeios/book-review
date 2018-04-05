window.onload = function()
{
    var post = document.getElementsByClassName('post');
    var url = window.location.href;
    var urlSplitted = url.split('/')
    var postID = urlSplitted[4];
    // load post
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
    // load categories of the post
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
    // load  comment of the post
    var requestCmt = new XMLHttpRequest();
    requestCmt.open('GET', 'http://localhost:8000/api/comments/'+postID);
    requestCmt.onload = function()
    {
        var cmts = JSON.parse(this.response);
        var comment = document.getElementsByClassName('comment');
        for(var cmt of cmts)
        {
            var username = document.createElement('h4');
            username.textContent = cmt.name;
            comment.item(0).appendChild(username);
            var cmtContent = document.createElement('p');
            cmtContent.textContent = cmt.content;
            comment.item(0).appendChild(cmtContent);
            comment.item(0).appendChild(document.createElement('br'));
        }        
    }
    requestCmt.send();
    // send comment
    var formDataCmt = new FormData();
    var cmtSubmitButton = document.getElementById('commentSubmit');
    var commentContent = document.getElementById('commentContent');
    cmtSubmitButton.onclick = function()
    {
        formDataCmt.append('content', commentContent.value);
        var today = new Date();
        // getDate returns the  day of the month while getDay returns the day of the week
        var day = today.getDate();
        // getMonth return 0 if it is January
        var month = today.getMonth()+1;
        var year = today.getFullYear();
        // if the month or day 1-9, need to add 0 before,  
        if(day < 10)
        {
            day = '0' + day;
        }
        if(month < 10)
        {
            month = '0' + month;
        }
        var todayStr = year+month+day;
        // add data to the form data
        formDataCmt.append('dateCreated', todayStr);
        formDataCmt.append('dateModified', todayStr);
        formDataCmt.append('idusers', '1');
        formDataCmt.append('idposts', postID);
        formDataCmt.append('posts_idusers', '1');
        // parse the form data
        var formDataCmtJsonObject = new Object;
        for(var entry of formDataCmt.entries())
        {
            formDataCmtJsonObject[entry[0]] = entry[1];
        }
        var formDataCmtJsonString = JSON.stringify(formDataCmtJsonObject);
        console.log(formDataCmtJsonString);
        // send the data of the comment
        var requestSendCmt = new XMLHttpRequest();
        requestSendCmt.open('POST', 'http://localhost:8000/api/send-comment');
        requestSendCmt.setRequestHeader('Content-Type','application/json');
        requestSendCmt.send(formDataCmtJsonString);
        requestSendCmt.onload = function()
        {
            console.log('Comment sent');
        }
        requestSendCmt.onerror = function()
        {
            console.log('Error sending the comment');
        }
    }
}
