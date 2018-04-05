window.onload = function()
{
    // load the categories
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
            categSelection.setAttribute('id', ''+data[i].idCategory);
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
    // get ready to pack the post and send to the db
    var formData = new FormData();
    var title = document.getElementById('postTitle');
    var content = document.getElementById('postContent');
    var submitButton = document.getElementById('submitButton');
    var req = new XMLHttpRequest();
    submitButton.onclick = function(event)
    {
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
        console.log(todayStr);
        formData.append('dateCreated', todayStr);
        formData.append('dateModified', todayStr);
        formData.append('idusers', '1');
        // parse formData to json
        var formDataJSObject = new Object;
        // formData formed by entries which have a pair of key (the first one in the pair) and value (the latter one in the pair)
        for(var entry of formData.entries())
        {
            formDataJSObject[entry[0]] = entry[1];
        }
        // send data in JSON string to the server
        var formDataJSON = JSON.stringify(formDataJSObject);
        console.log(formDataJSON);
        req.open('POST', 'http://localhost:8000/api/compose-post/', true);
        req.setRequestHeader('Content-Type', 'application/json');
         // the id of the newly created post
         var postID;
        let promise = new Promise(function(resolve, reject)
        {
            req.onload = function()
            {
                console.log('Request done');
                postID = JSON.parse(this.response)[0].insertId;
                // post request send back an array, the first one contain insertId is the id of the post
            };
            req.onerror = function()
            {
                console.log('Error sending request');
            };
            req.send(formDataJSON);
        });
        // record the relationship between post and category
        // var requestPostHasCateg = new XMLHttpRequest();
        // requestPostHasCateg.open('POST', 'http://localhost:8000/api/compose-post/has-categ');
        // requestPostHasCateg.setRequestHeader('Content-Type', 'application/json');
        // var formDataPostsHasCateg = new FormData();
        // var categSelected = document.querySelector('input[name="categ"]:checked')
        // formDataPostsHasCateg.append('idposts', postID);
        // formDataPostsHasCateg.append('posts_idusers', '1');
        // formDataPostsHasCateg.append('idCategory',categSelected.value);
        // requestPostHasCateg.onload = function()
        // {
        //     console.log('Recorded relationship between post and categ');
        // }
        // requestPostHasCateg.onerror = function()
        // {
        //     console.log('Error recording relationship');
        // }
        // requestPostHasCateg.send(JSON.stringify(formDataPostsHasCateg));
    }
    
}
