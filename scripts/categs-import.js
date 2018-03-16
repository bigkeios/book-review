var categs = document.getElementsByClassName('categs');
var request = new XMLHttpRequest();
request.open('GET', '../categs.json', true);
request.onload = function()
{
    var data = JSON.parse(this.response);
    populateCateg(data);
}
function populateCateg(jsonData)
{
    var categList = document.createElement('ul');
    categs.item(0).appendChild(categList);
    for(var i = 0; i < jsonData.length; ++i)
    {
        // creating element to store a categ with its attributes
        var categName = document.createElement('li');
        //putting data into newly created elements
        categName.textContent = jsonData[i].categName;
        //append the new elements into the document (categs div to be specific)
        // categs is obtained from getElementByClassName so it is a HTMLCollection -> access first elements through item()
        categList.appendChild(categName);
    }
}
request.send();