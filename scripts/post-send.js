window.onload = function()
{
    var formData = new FormData();
    var title = this.document.getElementById('postTitle');
    var content = this.document.getElementById('postContent');
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
        var todayNum = year + month + day;
        console.log(todayNum);
        formData.append('dateCreated', todayNum);
        formData.append('dateModified', todayNum);
        formData.append('categId', '1');
        formData.append('user_id', '1');
        // parse formData to json
        var formDataJSObject = new Object;
        for(var entry of formData.entries())
        {
            formDataJSObject[entry[0]] = entry[1];
        }
        // send data in JSON string to the server
        var formDataJSON = JSON.stringify(formDataJSObject);
        console.log(formDataJSON);
        req.open('POST', 'http://localhost:8000/compose-post/', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.onload = function()
        {
            console.log('Request done');
        };
        req.onerror = function()
        {
            console.log('Error sending request');
        };
        req.send(formDataJSON);
    }
    
}
