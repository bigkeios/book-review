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
            categSelection.addEventListener('change', catchDataChange);
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
    var post;
    requestPost.onload = function()
    {
        post = JSON.parse(this.response)
        title.value = post[0].title;
        content.value = post[0].content;
    }
    requestPost.send();
    // load categories selection of the post
    var requestCategs = new XMLHttpRequest();
    requestCategs.open('GET', 'http://localhost:8000/api/categs/'+postID);
    var categs;
    requestCategs.onload = function()
    {
        categs = JSON.parse(this.response);
        for(categ of categs)
        {
            for(child of categsSelect.children)
            {
                if(child.getAttribute('value') == categ.name)
                {
                    child.setAttribute('checked', 'true');
                }
            }
        }
    }
    requestCategs.send();
    // load the tags of the post
    var requestTags = new XMLHttpRequest();
    requestTags.open('GET', 'http://localhost:8000/api/tags/'+postID);
    var tags;
    requestTags.onload = function()
    {
        // these are the old tags
        tags = JSON.parse(this.response);
        for(tag of tags)
        {
            tagsField.value += tag.name + ', ';
        }
    }
    requestTags.send();
    // get the elements' value that changes
    // vars to record changes
    // patch is the description for changes, supposed to be sent with PATCH request
    var patchesPost= [];
    var hasCategAdds = [];
    var hasCategDels = [];
    var diffTags = [];
    var discardedTags = [];
    var regexCategID = new RegExp('^[1-9]*$')
    title.addEventListener('change', catchDataChange);
    content.addEventListener('change', catchDataChange);
    tagsField.addEventListener('change', catchDataChange);
    function catchDataChange(e)
    {
        var fieldChangedID = e.target.getAttribute('id');
        if(fieldChangedID === 'postTitle')
        {
            patchesPost.push({op: "replace", path: "/title", value:title.value});
        }
        else if (fieldChangedID === 'postContent')
        {
            patchesPost.push({op: "replace", path: "/content", value:content.value});
        }
        else if(fieldChangedID === 'postTag')
        {
            // compare old tags and new tags
            // -> same -> let them be
            // -> different --> save new rela and delete old rela
            var editTags = tagsField.value;
            var editTagsSplitted = editTags.split(', ');
            if(tags)
            {
                // find different tags from the old ones
                for(editTag of editTagsSplitted)
                {
                    var diff = false;
                    for(oldTag of tags)
                    {
                        if(editTag != oldTag.name)
                        {
                            diff = true;
                        }
                        else
                        {
                            diff = false;
                            break;
                        }
                    }
                    // if the tag different from all old tags, it is the different tag
                    if(diff)
                    {
                        diffTags.push(editTag);
                    }
                }
                // find the old tag that was removed
                for(oldTag of tags)
                {
                    var discarded = false;
                    for(editTag of editTagsSplitted)
                    {
                        if(oldTag.name != editTag)
                        {
                            discarded = true;
                        }
                        else
                        {
                            discarded = false;
                            break;
                        }
                    }
                    if(discarded)
                    {
                        discardedTags.push(oldTag.name);
                    }
                }
            }
            if(!tags.length)
            {
                for(tag of editTagsSplitted)
                {
                    diffTags.push(tag);
                }
            }
        }
        // check the categs that has checking changed
        else if(regexCategID.test(fieldChangedID))
        {
            // if it is newly checked, this is a new relationship -> post request for rela 
            if(document.getElementById(fieldChangedID).checked == true)
            {
                var hasCategAdd = 
                {
                    idCategory: fieldChangedID,
                    idposts: postID,
                    posts_idusers: 1
                };
                hasCategAdds.push(hasCategAdd);
            }
            // if is unchecked, an existed relationship disappeared -> delete request for rela
            else if(document.getElementById(fieldChangedID).checked == false)
            {
                var hasCategDel =
                {
                    idCategory: fieldChangedID,
                    idposts: postID    
                };
                hasCategDels.push(hasCategDel);
            }
        }
    }
    // send the changes
    var submitButton = document.getElementById('submitButton');
    submitButton.onclick = function(e)
    {
        if(patchesPost)
        {
            var okPost;
            var okHasCateg;
            var okHasTag;
            // add modified date for patch of post's changes
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
            patchesPost.push({op: "replace", path: "/dateModified", value:todayStr});
            // submit post changes
            // parse patches into json
            patchesPost = JSON.stringify(patchesPost);
            var requestPostChanges = new XMLHttpRequest();
            requestPostChanges.open('PATCH', 'http://localhost:8000/api/posts/'+postID);
            requestPostChanges.setRequestHeader('Content-Type', 'application/json');
            requestPostChanges.setRequestHeader('X-HTTP-Method-Override', 'PATCH');
            requestPostChanges.send(patchesPost);
            requestPostChanges.onloadend = function()
            {
                patchesPost = null;
                okPost = true;
            }
            // submit changes in relationship with category
            if(hasCategAdds)
            {
                for(hasCategAdd of hasCategAdds)
                {
                    var requestAddHasCateg = new XMLHttpRequest();
                    requestAddHasCateg.open('POST', 'http://localhost:8000/api/has-categ');
                    requestAddHasCateg.setRequestHeader('Content-Type', 'application/json');
                    requestAddHasCateg.onload = function()
                    {
                        console.log('New rela being sent');
                    }
                    console.log(hasCategAdd);
                    requestAddHasCateg.send(JSON.stringify(hasCategAdd));
                }
            }
            if(hasCategDels)
            {
                for(hasCategDel of hasCategDels)
                {
                    var requestDelHasCateg = new XMLHttpRequest();
                    requestDelHasCateg.open('DELETE', 'http://localhost:8000/api/has-categ');
                    requestDelHasCateg.setRequestHeader('Content-Type', 'application/json');
                    requestDelHasCateg.onload = function()
                    {
                        console.log('A rela being deleted');
                    }
                    requestDelHasCateg.send(JSON.stringify(hasCategDel));
                }
            }
            // send the diff tags to save new one if necessary and get its id to record rela
            console.log(diffTags);
            if(diffTags)
            {
                for(tag of diffTags)
                {
                    var tagObject = 
                    {
                        name: tag
                    };
                    var diffTagID;
                    var requestDiffTag = new XMLHttpRequest();
                    requestDiffTag.open('POST', 'http://localhost:8000/api/tags');
                    requestDiffTag.setRequestHeader('Content-Type', 'application/json');
                    let promise = new Promise(function(resolve, reject)
                    {
                        requestDiffTag.send(JSON.stringify(tagObject));
                        requestDiffTag.onload = function()
                        {
                            var response = JSON.parse(this.response);
                            // if the response has idtag, get the id of tag existed returned
                            if(response.idtag)
                            {
                                resolve(response.idtag);
                            }
                            // if the response has insertId, get the id of tag newly created from result of inserting returned
                            else if(response.insertId)
                            {
                                resolve(response.insertId);
                            }
                        }
                    });
                    // save rela
                    promise.then(function(msgSuccess)
                    {
                        diffTagID = msgSuccess;
                        var hasTag = 
                        {
                            idposts: postID,
                            posts_idusers: 1,
                            idtag: diffTagID
                        };
                        var requestHasTagAdd = new XMLHttpRequest();
                        requestHasTagAdd.open('POST', 'http://localhost:8000/api/has-tag');
                        requestHasTagAdd.setRequestHeader('Content-Type', 'application/json');
                        requestHasTagAdd.send(JSON.stringify(hasTag));
                        requestHasTagAdd.onload = function()
                        {
                            console.log('New tags are being recorded');
                        }
                    });
                }
            }
            // delete the relationship with old tags
            console.log(discardedTags);
            if(discardedTags)
            {
                for (tag of discardedTags)
                {
                    var requestDelHasTag = new XMLHttpRequest();
                    var hasTagDel = 
                    {
                        idposts: postID,
                        name: tag
                    }
                    requestDelHasTag.open('DELETE','http://localhost:8000/api/has-tag');
                    requestDelHasTag.setRequestHeader('Content-Type', 'application/json');
                    requestDelHasTag.send(JSON.stringify(hasTagDel));
                    requestDelHasTag.onload = function()
                    {
                        console.log('Deleting old rela');
                    }
                }
            }
        }
        // redirect to the post 
        window.location.assign('http://localhost:8000/post-view-index/'+postID);
    }
}