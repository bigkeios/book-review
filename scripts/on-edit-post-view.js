window.onload = function()
{
    // get the ID of the post
    var post = document.getElementsByClassName('post');
    var url = window.location.href;
    var urlSplitted = url.split('/')
    var postID = urlSplitted[4];
    //load the categories
    var categsSelect = document.getElementById('categoriesSelect');
    var requestCategsAll = new XMLHttpRequest();
    requestCategsAll.open('GET','http://localhost:8000/api/categs');
    requestCategsAll.onload = function()
    {
        var categs = JSON.parse(this.response);
        populateCategs(categs);
    }
    function populateCategs(data)
    {
        for(var i = 0; i < data.length; ++i)
        {
            var categSelection = document.createElement('input');
            categSelection.setAttribute('type', 'checkbox');
            categSelection.setAttribute('id', data[i].idCategory);
            categSelection.setAttribute('value', data[i].name);
            categSelection.setAttribute('name', 'categ');
            var label = document.createElement('label');
            label.setAttribute('for', categSelection.getAttribute('id'));
            label.textContent = data[i].name;
            categsSelect.appendChild(categSelection);
            categsSelect.appendChild(label);
        }
    }
    requestCategsAll.send();
    // load the data of the post atm
    var title = document.getElementById('postTitle');
    var content = document.getElementById('postContent');
    var tagsField = document.getElementById('postTag');
    // load the title and content of the post
    var requestPost = new XMLHttpRequest();
    requestPost.open('GET', 'http://localhost:8000/api/posts/'+postID);
    requestPost.onload = function()
    {
        var post = JSON.parse(this.response);
        title.value = post[0].title;
        content.value = post[0].content;
    }
    requestPost.send();
    // load the categories of the post
    var requestCategs = new XMLHttpRequest();
    requestCategs.open('GET', 'http://localhost:8000/api/categs/'+postID);
    requestCategs.onload = function()
    {
        var categs = JSON.parse(this.response);
        for(categ of categs)
        {
            for(child of categsSelect.children)
            {
                if(child.getAttribute('value') == categ.name)
                {
                    child.setAttribute('checked', 'true');
                }
                // assign event listener to each of categs
                child.addEventListener('change', catchDataChange);
            }
        }
    }
    requestCategs.send();
    // load the tags of the post
    var requestTags = new XMLHttpRequest();
    requestTags.open('GET', 'http://localhost:8000/api/tags/'+postID);
    requestTags.onload = function()
    {
        var tags = JSON.parse(this.response);
        for(tag of tags)
        {
            tagsField.value += tag.name + ', ';
        }
    }
    requestTags.send();
    // get the elements' value that changes
    var postChanges = new Object();
    var hasCategChanges = new Object();
    var hasTag = new Object();
    var regexCategID = new RegExp('^[1-9]*$')
    title.addEventListener('change', catchDataChange);
    content.addEventListener('change', catchDataChange);
    tagsField.addEventListener('change', catchDataChange);
    catchDataChange = function(e)
    {
        var fieldChangedID = e.target.getAttribute('id');
        if(fieldChangedID === 'postTitle')
        {
            postChanges['title'] = title.value;
        }
        else if (fieldChangedID === 'postContent')
        {
            postChanges['content'] = content.value;
        }
        else if(fieldChangedID === 'postTag')
        {

        }
        else if(regexCategID.test(fieldChangedID))
        {
            if(document.getElementById(fieldChangedID).getAttribute('checked') == true)
            {
                hasCategChanges['idCategory'] = fieldChangedID;
                hasCategChanges['idposts'] = postID;
            }
        }
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
        postChanges['dateModified'] = todayStr;
    }
    // send the changes
    var submitButton = document.getElementById('submitButton');
    submitButton.onclick = function(e)
    {
        // submit post changes
        var requestPostChanges = new XMLHttpRequest();
        requestPostChanges.open('PATCH', 'http://localhost:8000/api/posts/'+postID);
        requestPostChanges.send(JSON.stringify(postChanges));
        // submit changes in relationship with category
        var requestCategsChanges = new XMLHttpRequest();
        requestCategsChanges.open('PATCH', 'http://localhost:8000/api/has-categ');
    }
   
    var formData = new FormData();
    
    var req = new XMLHttpRequest();
    // pack the post and (new) tags and send it to the db
    submitButton.onclick = function(e)
    {
        e.preventDefault();
        // get all the elements in the form that change
        formData.append('title', title.value);
        formData.append('content', content.value);
        
        formData.append('dateCreated', todayStr);
        formData.append('dateModified', todayStr);
        formData.append('idusers', '1');
        // parse formData to json
        var formDataObject = new Object;
        // formData formed by entries which have a pair of key (the first one in the pair) and value (the latter one in the pair)
        for(var entry of formData.entries())
        {
            formDataObject[entry[0]] = entry[1];
        }
        // send data in JSON string to the server
        var formDataJSON = JSON.stringify(formDataObject);
        req.open('POST', 'http://localhost:8000/api/compose-post/', true);
        req.setRequestHeader('Content-Type', 'application/json');
         // the id of the newly created post
         var postID;
        let promise = new Promise(function(resolve, reject)
        {
            req.onload = function()
            {
                console.log('Request done');
                resolve(JSON.parse(this.response).insertId);
            };
            req.onerror = function()
            {
                console.log('Error sending request');
            };
            req.send(formDataJSON);
        });
    }
}