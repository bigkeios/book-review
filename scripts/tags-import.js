var tags = document.getElementsByClassName('tags');
var request = new XMLHttpRequest();
request.open('GET', 'http://localhost:8000/api/tags', true);
request.onload = function()
{
    var data = JSON.parse(this.response);
    populateTag(data);
}
function populateTag(jsonData)
{
    var tagList = document.createElement('ul');
    tags.item(0).appendChild(tagList);
    for(var i = 0; i < jsonData.length; ++i)
    {
        // creating element to store a tag (of the post, just the name)
        var tagName = document.createElement('li');
        //putting data into newly created elements
        tagName.textContent = jsonData[i].name;
        //append the new elements into the document (tags div to be specific)
        // tags is obtained from getElementByClassName so it is a HTMLCollection -> access first elements through item()
        tagList.appendChild(tagName);
    }
}
request.send();