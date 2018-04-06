window.onload = function()
{
    //------------ load the categories
    var categsSelect = document.getElementById('categoriesSelect');
    var requestCateg = new XMLHttpRequest();
    requestCateg.open('GET','http://localhost:8000/api/categs');
    requestCateg.onload = function()
    {
        var categs = JSON.parse(this.response);
        populateCategs(categs);
    }
    function populateCategs(data)
    {
        for(var i = 0; i < data.length; ++i)
        {
            var categSelection = document.createElement('input');
            categSelection.setAttribute('type', 'radio');
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
    requestCateg.send();
    //------------ send the post and related data
    var formData = new FormData();
    var title = document.getElementById('postTitle');
    var content = document.getElementById('postContent');
    var submitButton = document.getElementById('submitButton');
    var req = new XMLHttpRequest();
    // pack the post and (new) tags and send it to the db
    submitButton.onclick = function(event)
    {
        // send the post
        event.preventDefault();
        // get all the elements in the form for composing post
        formData.append('title', title.value);
        formData.append('content', content.value);
        // add created date and modified date (=create date), creator and categ id
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
        promise.then(function(msgSuccess)
        {
            postID = msgSuccess;
            //------------ send the new tags if there are any
            // split the tags
            var tagsString = document.getElementById('postTag').value;
            // if there are tags specified, specify tags and send them
            if(tagsString)
            {   
                var tagsObject = [];
                var tagsSplitted = tagsString.split(', ');
                // create array of tag object to parse
                for(tag of tagsSplitted)
                {
                    var tagObject = new Object();
                    tagObject['name'] = tag;
                    tagsObject.push(tagObject);
                }
                // parse the objects into json
                var tagsJSON = [];
                for(object of tagsObject)
                {
                    var tagJSON = JSON.stringify(object);
                    tagsJSON.push(tagJSON);
                }
                // putting each of them into the db to save new tags
                for(tag of tagsJSON)
                {
                    // request to create new tag
                    // the request will send back the id of the newly created tag
                    var requestTag = new XMLHttpRequest();
                    requestTag.open('POST', 'http://localhost:8000/api/create-tag');
                    requestTag.setRequestHeader('Content-Type', 'application/json');
                    var tagID;
                    let promise = new Promise(function(resolve, reject)
                    {
                        requestTag.onload = function()
                        {
                            if(this.response)
                            {
                                resolve(JSON.parse(this.response).insertId);
                            }
                            console.log('Tag sent');
                        }
                        requestTag.onerror = function()
                        {
                            console.log('Error sending');
                        }
                        requestTag.send(tag);
                    });
                    promise.then(function(msgSuccess)
                    {
                        tagID = msgSuccess;
                        if(tagID)
                        {
                            // pack data to send
                            var formDataPostHasTag = new FormData();
                            formDataPostHasTag.append('idposts', postID);
                            formDataPostHasTag.append('posts_idusers', 1);
                            formDataPostHasTag.append('idtag', tagID);
                            var formDataHasTagObject = new Object();
                            for(entry of formDataPostHasTag.entries())
                            {
                                formDataHasTagObject[entry[0]] = entry[1];
                            }
                            var formDataHasTagJSON = JSON.stringify(formDataHasTagObject);
                            // request to record the relationship between the tag and the post
                            var requestPostHasTag = new XMLHttpRequest();
                            requestPostHasTag.open('POST', 'http://localhost:8000/api/has-tag');
                            requestPostHasTag.setRequestHeader('Content-Type', 'application/json');
                            requestPostHasTag.send(formDataHasTagJSON);
                            requestPostHasTag.onload = function()
                            {
                                console.log('Info about the newly created post and its tag was sent');
                            }
                            requestPostHasTag.onerror = function()
                            {
                                console.log('Error sending info about the post and its tags');
                            }
                        }
                    });
                    // record the relationship between post and category
                    var requestPostHasCateg = new XMLHttpRequest();
                    requestPostHasCateg.open('POST', 'http://localhost:8000/api/has-categ');
                    requestPostHasCateg.setRequestHeader('Content-Type', 'application/json');
                    // pack data to send
                    var formDataPostsHasCateg = new FormData();
                    var categSelected = document.querySelector('input[name="categ"]:checked')
                    formDataPostsHasCateg.append('idposts', postID);
                    formDataPostsHasCateg.append('posts_idusers', '1');
                    formDataPostsHasCateg.append('idCategory', categSelected.getAttribute('id'));
                    requestPostHasCateg.onload = function()
                    {
                        console.log('Recorded relationship between post and categ');
                    }
                    requestPostHasCateg.onerror = function()
                    {
                        console.log('Error recording relationship');
                    }
                    requestPostHasCateg.send(JSON.stringify(formDataPostsHasCateg));  
                }
            }
        })
    }
    
}