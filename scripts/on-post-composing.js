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
    requestCateg.send();
    //------------ send the post and related data
    var formData = new FormData();
    var title = document.getElementById('postTitle');
    var content = document.getElementById('postContent');
    var submitButton = document.getElementById('submitButton');
    var cancelButton = document.getElementById('cancelButton');
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
        let promisePost = new Promise(function(resolve, reject)
        {
            req.open('POST', 'http://localhost:8000/api/posts/', true);
            req.setRequestHeader('Content-Type', 'application/json');
            // the id of the newly created post
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
        promisePost.then(function(msgSuccess)
        {
            var promiseHasCateg;
            var promiseHasTag;
            var postID = msgSuccess;
            //------------ create new tag if there are any and record the relationship between tags and the post
            // split the tags
            var tagsString = document.getElementById('postTag').value;
            // if there are tags specified, specify tags and send them
            if(tagsString)
            {   
                promiseHasTag = new Promise(function(resolve, reject)
                {
                    var tagsSplitted = tagsString.split(', ');
                    // send the tags to the database to save new ones or know the id of which tag was specified 
                    for(tag of tagsSplitted)
                    {
                        var tagObject =
                        {
                            name: tag
                        }
                        var tagJSON = JSON.stringify(tagObject);
                        var tagID;
                        let promise = new Promise(function(resolve, reject)
                        {
                            // request to create new tag
                            // the request will send back the id of the newly created tag
                            var requestTag = new XMLHttpRequest();
                            requestTag.open('POST', 'http://localhost:8000/api/tags');
                            requestTag.setRequestHeader('Content-Type', 'application/json');
                            requestTag.send(tagJSON);
                            requestTag.onload = function()
                            {
                                if(requestTag.status != 200)
                                {
                                    reject();
                                }
                                // return the id of the newly created tag or the tag that was sent but has existed
                                else if(this.response)
                                {
                                    var response = JSON.parse(this.response);
                                    // if the response has insertId, a new tag was created
                                    if(response.insertId)
                                    {
                                        resolve(response.insertId);
                                    }
                                    // if the response has idtag, a tag that has existed was found
                                    else if(response.idtag)
                                    {
                                        resolve(response.idtag);
                                    }
                                }
                                console.log('Tag sent');
                            }
                            requestTag.onerror = function()
                            {
                                console.log('Error sending');
                                reject();
                            }
                        });
                        promise.then(function(msgSuccess)
                        {
                            tagID = msgSuccess;
                            console.log(tagID);
                            if(tagID)
                            {
                                // request to record the relationship between the tag and the post
                                var requestPostHasTag = new XMLHttpRequest();
                                requestPostHasTag.open('POST', 'http://localhost:8000/api/posts/'+postID+'/tags/'+tagID);
                                requestPostHasTag.setRequestHeader('Content-Type', 'application/json');
                                requestPostHasTag.send(JSON.stringify({posts_idusers:1}));
                                requestPostHasTag.onload = function()
                                {
                                    console.log('Info about the newly created post and its tag was sent');
                                    if(requestPostHasTag.status != 200)
                                    {
                                        reject();
                                    }
                                }
                                requestPostHasTag.onerror = function()
                                {
                                    console.log('Error sending info about the post and its tags');
                                    reject();
                                }
                            }
                        });
                    }
                    resolve();
                });
                
            }
            // ------------record the relationship between the post and categories
            promiseHasCateg = new Promise(function(resolve, reject)
            {
                var categsSelected = document.querySelectorAll('input[name="categ"]:checked');
                for(categSelected of categsSelected)
                {
                    // record the relationship between post and category
                    
                        var requestPostHasCateg = new XMLHttpRequest();
                        requestPostHasCateg.open('POST', 'http://localhost:8000/api/posts/'+postID+'/categories/'+categSelected.getAttribute('id'));
                        requestPostHasCateg.setRequestHeader('Content-Type', 'application/json');
                        requestPostHasCateg.send(JSON.stringify({posts_idusers: 1}));
                        requestPostHasCateg.onload = function()
                        {
                            console.log('Recorded relationship between post and categ');
                            if(requestPostHasCateg.status != 200)
                            {
                                reject();
                            }
                        }
                        requestPostHasCateg.onerror = function()
                        {
                            console.log('Error recording relationship');
                            reject();
                        }                
                }
                resolve();
            });
            Promise.all([promiseHasCateg, promiseHasTag]).then(function(allResolves)
            {
                // redirect to the post newly created
                window.location.assign('http://localhost:8000/post-view-index/'+postID);
            });
        });   
    }
    cancelButton.onclick = function(e)
    {
        var confirmDiscard = window.confirm('Are you sure you want to discard the post?');
        if(confirmDiscard)
        {
            window.location.assign('http://localhost:8000/home-view-index.html');
        }
    }
}
