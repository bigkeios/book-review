window.onload = function()
{
    var post = document.getElementsByClassName('post');
    var url = window.location.href;
    var urlSplitted = url.split('/')
    var postID = urlSplitted[4];
    //------------------- load post
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
    //------------------- load categories of the post
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
    //------------------- load  comment of the post
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
    //------------------- send comment
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
    //------------------- toggle the menu edit/delete
    // get the menu and icon to edit/delete post
    var modifyMenu = document.getElementsByClassName('modifyMenu');
    // get the one of the post div
    var menuPost = modifyMenu.item(0);
    // get the one of the comment div
    var menuCmt = modifyMenu.item(1);
    menuPost.addEventListener('click', toggleMenu);
    menuCmt.addEventListener('click', toggleMenu);
    function toggleMenu(e)
    {
        // evt.target -> menuPost/menuCmt/anything that calls toggleMenu in its eventListener
        // we got clickedIcon bc we clicked on the icon and the id returned is from the icon
        var clickedIcon = document.getElementById(e.target.getAttribute('id'));
        var menu;
        if(clickedIcon.getAttribute('id') === 'menuSelectOnPost')
        {
            menu = document.getElementById('menuOptionsOnPost');
        }
        else if(clickedIcon.getAttribute('id') === 'menuSelectOnCmt')
        {
            menu = document.getElementById('menuOptionsOnCmt');
        }
        try
        {
            // toggle the menu. this only works with inline style somehow
            if(menu.style.display === 'none')
            {
                menu.style.display = 'block';
            }
            else if(menu.style.display === 'block')
            {
                menu.style.display = 'none';
            }
        }
        catch(TypeError)
        {
            console.log("TypeError caught");
        }
    }
    // confirmation window on clicking delete
    // get delete option
    var deleteOption = document.getElementsByClassName('deleteOption');
    // get the delete option in the post div
    deleteOption.item(0).addEventListener('click', alertDelete);
    // get the delete option in the comment div
    deleteOption.item(1).addEventListener('click', alertDelete);
    function alertDelete(e)
    {
        // e plays the same role as in toggleMenu
        // get the id of the option to know where it is from
        var clickedOptionID = e.target.getAttribute('id');
        var eleType;
        if(clickedOptionID === 'deleteOptionOnPost')
        {
            eleType = 'post';
        }
        else if(clickedOptionID === 'deleteOptionOnCmt')
        {
            eleType = 'comment';
        }
        window.confirm('Are you sure you want to delete this ' + eleType);
    }
}
