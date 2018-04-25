window.onload = function()
{
    var post = document.getElementsByClassName('post');
    var url = window.location.href;
    var urlSplitted = url.split('/')
    var postID = urlSplitted[4];
    //------------------- load post
    var requestPost = new XMLHttpRequest();
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
    requestCateg.open('GET','http://localhost:8000/api/posts/'+postID+'/categories');
    requestCateg.onload = function()
    {
        var categs = JSON.parse(this.response);
        var categsDetails = document.createElement('p');
        categsDetails.textContent = 'Categories: ';
        if(categs)
        {
            for(var categ of categs)
            {
                categsDetails.textContent += categ.name + ', ';
            }
        }
        post.item(0).appendChild(categsDetails);
    }
    requestCateg.send();
    //------------------- load tags of the post
    var requestTag = new XMLHttpRequest();
    requestTag.open('GET', 'http://localhost:8000/api/tags/'+postID+'/tags');
    requestTag.onload = function()
    {
        var tags = JSON.parse(this.response);
        var tagsDetails = document.createElement('p');
        tagsDetails.textContent = 'Tags: ';
        if(tags)
        {
            for(var tag of tags)
            {
                tagsDetails.textContent += tag.name + ', ';
            }
        }
        post.item(0).appendChild(tagsDetails);
    }
    requestTag.send();
    //------------------- load  comment of the post
    // load comments' content
    var requestCmt = new XMLHttpRequest();
    requestCmt.open('GET', 'http://localhost:8000/api/comments/'+postID);
    requestCmt.onload = function()
    {
        var cmts = JSON.parse(this.response);
        var comments = document.getElementsByClassName('comments');
        for(var cmt of cmts)
        {
            // create div for a new comment
            var comment = document.createElement('div');
            comment.setAttribute('class', 'comment');
            comment.setAttribute('id', 'comment#'+cmt.idcomment);
            comments.item(0).appendChild(comment);
            // create the edit/delete menu for the comment
            var modifyMenu = document.createElement('div');
            modifyMenu.setAttribute('class', 'modifyMenu');
            modifyMenu.addEventListener('click', toggleMenu);
            comment.appendChild(modifyMenu);
            var modifyMenuLink = document.createElement('a');
            modifyMenuLink.setAttribute('href', '#');
            modifyMenu.appendChild(modifyMenuLink);
            var modifyMenuLinkIcon = document.createElement('img');
            modifyMenuLinkIcon.setAttribute('class','menuSelect');
            modifyMenuLinkIcon.setAttribute('id','menuSelectOnCmt#'+cmt.idcomment);
            modifyMenuLinkIcon.setAttribute('src','../public/option.svg');
            modifyMenuLinkIcon.setAttribute('height','15');
            modifyMenuLinkIcon.setAttribute('width','15');
            modifyMenuLink.appendChild(modifyMenuLinkIcon);
            var menuOptions = document.createElement('ul');
            menuOptions.setAttribute('class', 'menuOptions');
            menuOptions.setAttribute('id', 'menuOptionsOnCmt#'+cmt.idcomment);
            menuOptions.setAttribute('style', 'display:none');
            var editOptionLi = document.createElement('li');
            var editOptionA = document.createElement('a');
            editOptionA.setAttribute('class', 'editOption');
            editOptionA.setAttribute('id', 'editOptionOnCmt#'+cmt.idcomment);
            editOptionA.setAttribute('href', '');
            editOptionA.addEventListener('click', chooseToEdit);
            editOptionA.textContent =  'Edit';
            editOptionLi.appendChild(editOptionA);
            menuOptions.appendChild(editOptionLi);
            var deleteOptionLi = document.createElement('li');
            var deleteOptionA = document.createElement('a');
            deleteOptionA.setAttribute('class', 'deleteOption');
            deleteOptionA.setAttribute('id', 'deleteOptionOnCmt#'+cmt.idcomment);
            deleteOptionA.setAttribute('href','#');
            deleteOptionA.addEventListener('click', chooseToDelete);
            deleteOptionA.textContent =  'Delete';
            deleteOptionLi.appendChild(deleteOptionA);
            menuOptions.appendChild(deleteOptionLi);
            modifyMenu.appendChild(menuOptions);
            // putting the content of the comment in
            var username = document.createElement('h4');
            username.textContent = cmt.name;
            comment.appendChild(username);
            var dateSent = document.createElement('small');
            console.log(cmt);
            var dateCreated = new Date(cmt.dateCreated);
            dateSent.textContent = dateCreated.toDateString();
            comment.appendChild(dateSent);
            var cmtContent = document.createElement('p');
            cmtContent.textContent = cmt.content;
            comment.appendChild(cmtContent);
            comment.appendChild(document.createElement('hr'));
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
        requestSendCmt.open('POST', 'http://localhost:8000/api/comments');
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
        // reload to show new comment
        window.location.reload(true);
    }
    //------------------- toggle the menu edit/delete
    // get the menu and icon to edit/delete post
    var modifyMenu = document.getElementsByClassName('modifyMenu');
    // get the one of the post div
    var menuPost = modifyMenu.item(0);
    menuPost.addEventListener('click', toggleMenu);
    // the one of the comment div was assigned the event listener
    function toggleMenu(e)
    {
        // evt.target -> menuPost/menuCmt/anything that calls toggleMenu in its eventListener
        // we got clickedIcon bc we clicked on the icon and the id returned is from the icon
        e.preventDefault();
        var clickedIconID = e.target.getAttribute('id');
        var menu;
        var regexMenuCmt = new RegExp('menuSelectOnCmt*');
        if(clickedIconID === 'menuSelectOnPost')
        {
            menu = document.getElementById('menuOptionsOnPost');
        }
        else if(regexMenuCmt.test(clickedIconID))
        {
            var idClickedSplitted = clickedIconID.split('#');
            menu = document.getElementById('menuOptionsOnCmt#'+idClickedSplitted[1]);
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
    // Delete option
    var deleteOption = document.getElementsByClassName('deleteOption');
    // get the delete option in the post div
    deleteOption.item(0).addEventListener('click', chooseToDelete);
    // the delete option in the comment div was assigned the event listener when the comments are load
    function chooseToDelete(e)
    {
        // e plays the same role as in toggleMenu
        // get the id of the option to know where it is from
        var clickedOptionID = e.target.getAttribute('id');
        var eleType;
        var regexDeleteCmt = new RegExp('deleteOptionOnCmt*');
        if(clickedOptionID === 'deleteOptionOnPost')
        {
            eleType = 'post';
        }
        else if(regexDeleteCmt.test(clickedOptionID))
        {
            eleType = 'comment';
        }
        var confirm = window.confirm('Are you sure you want to delete this ' + eleType);
        if(confirm)
        {
            if(eleType === 'post')
            {
                // delete the relationship between the post and categs
                var requestDelRelaCateg = new XMLHttpRequest();
                requestDelRelaCateg.open('DELETE', 'http://localhost:8000/api/posts/'+postID+'/categories');
                requestDelRelaCateg.onload = function()
                {
                    console.log('Relationship with categs being deleted');
                }
                requestDelRelaCateg.send();
                // delete the relationship between the post and tags
                var requestDelRelaTag = new XMLHttpRequest();
                requestDelRelaTag.open('DELETE', 'http://localhost:8000//api/posts/'+postID+'/tags');
                requestDelRelaTag.onload = function()
                {
                    console.log('Relationship with tags being deleted');
                }
                requestDelRelaTag.send();
                // delete the comments of the post
                var requestDelCommentOfPost = new XMLHttpRequest();
                requestDelCommentOfPost.open('DELETE', 'http://localhost:8000/api/posts/' + postID + '/comments');
                requestDelCommentOfPost.send();
                requestDelCommentOfPost.onload = function()
                {
                    console.log('Comments of post are being deleted');
                }
                // delete the post
                var requestDelPost = new XMLHttpRequest();
                requestDelPost.open('DELETE', 'http://localhost:8000/api/posts/'+postID);
                requestDelPost.onload = function()
                {
                    console.log('Post being delete');
                }
                requestDelPost.send();
                // redirect to home page
                window.location.assign('http://localhost:8000/');
            }
            else if(eleType === 'comment')
            {
                var idClickedSplitted = clickedOptionID.split('#');
                var commentID = idClickedSplitted[1];
                var requestDelComment = new XMLHttpRequest();
               requestDelComment.open('DELETE', 'http://localhost:8000/api/comments/'+commentID);
               var cmtDelInfo = 
                {
                    idposts: postID
                };
               requestDelComment.onload = function()
               {
                   console.log('Comment being deleted');
               }
               requestDelComment.send();
               // reload the page to display changes
                window.location.reload(true);
            }
        }
    }
    // Edit option
    var editOption = document.getElementsByClassName('editOption');
    // get the option on post
    editOption.item(0).addEventListener('click', chooseToEdit);
    // the event listeners for options on comments were assigned when they are loaded
    function chooseToEdit(e)
    {
        var clickedOptionID = e.target.getAttribute('id');
        var regexEditCmt = new RegExp('editOptionOnCmt*');
        // edit for the post
        if(clickedOptionID === 'editOptionOnPost')
        {
            
            window.location.assign('http://localhost:8000/edit-post-index/'+postID);
        }
        // edit for the comment
        if(regexEditCmt.test(clickedOptionID))
        {
            var idEditSelectSplitted = clickedOptionID.split('#');
            var commentID = idEditSelectSplitted[1]
            var comment = document.getElementById('comment#'+commentID);
            var commentContent = comment.getElementsByTagName('p')[0];
            // create a new node to replace the comment's content which will be replaced by a textarea for editing comment
            var cmtEdit = document.createElement('div');
            cmtEdit.setAttribute('class', 'editComment');
            var cmtEditTArea = document.createElement('textarea');
            cmtEditTArea.setAttribute('rows', '5');
            cmtEditTArea.setAttribute('cols', '100')
            cmtEditTArea.value = commentContent.textContent;
            cmtEdit.appendChild(cmtEditTArea);
            var cmtSaveButton = document.createElement('input');
            cmtSaveButton.setAttribute('type', 'submit');
            cmtSaveButton.setAttribute('value', 'Save');
            cmtSaveButton.setAttribute('id', 'cmtChangesSave');
            cmtEdit.appendChild(cmtSaveButton);
            var cmtCancelButton = document.createElement('input');
            cmtCancelButton.setAttribute('type', 'submit');
            cmtCancelButton.setAttribute('value', 'Cancel');
            cmtCancelButton.setAttribute('id', 'cmtChangesDiscard');
            cmtEdit.appendChild(cmtCancelButton);
            // replace commentContent with commentEdit
            comment.replaceChild(cmtEdit, commentContent);
            // catch content changes in comment
            var commentChanges = [];
            cmtEditTArea.onchange =  function(e)
            {
                commentChanges.push({op:'replace', path: '/content', value: e.target.value});
            }
            cmtSaveButton.onclick = function()
            {
                // add modified date
                var today = new Date();
                // getDate return the day of the month, while getDay returns day of thw week
                var day = today.getDate();
                var month = today.getMonth()+1;
                var year = today.getFullYear();
                // if day and month 1-9, need to add a zero
                if(day < 10)
                {
                    day = '0' + day;
                }
                if(month < 10)
                {
                    month = '0' + month;
                }
                var todayStr = year + month + day;
                commentChanges.push({op:'replace', path: '/dateModified', value: todayStr});
                // send the changes
                commentChanges = JSON.stringify(commentChanges);
                var requestCommentChanges = new XMLHttpRequest();
                requestCommentChanges.open('PATCH', 'http://localhost:8000/api/comments/'+commentID);
                requestCommentChanges.setRequestHeader('Content-Type', 'application/json');
                requestCommentChanges.setRequestHeader('X-HTTP-Method-Override', 'PATCH');
                requestCommentChanges.send(commentChanges);
                requestCommentChanges.onload = function()
                {
                    // if the request succeeded, reload to show changes
                    window.location.reload(true);
                }
            }
            cmtCancelButton.onclick = function()
            {
                comment.replaceChild(commentContent, cmtEdit);
            }
        }
    }
}
