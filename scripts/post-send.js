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
        formData.append('dateCreated', Date.now());
        formData.append('dateModified', Date.now());
        formData.append('categID', '1');
        formData.append('userID', '1');
        // parse formData to json
        var formDataJSObject = new Object;
        for(var entry of formData.entries())
        {
            formDataJSObject[entry[0]] = entry[1];
        }
        var formDataJSON = JSON.parse(JSON.stringify(formDataJSObject));
        req.open('POST', 'http://localhost:8000/compose-post/', true);
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
