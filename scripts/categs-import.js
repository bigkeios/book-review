var request = new XMLHttpRequest();
request.open('GET', 'http://localhost:8000/api/categs', true);
request.onload = function()
{
    var data = JSON.parse(this.response);
    populateCateg(data);
}
function populateCateg(jsonData)
{
    var categs = document.getElementsByClassName('categs');
    var categList = document.createElement('ul');
    // categs is obtained from getElementByClassName so it is a HTMLCollection -> access first elements through item()
    categs.item(0).appendChild(categList);
    for(var i = 0; i < jsonData.length; ++i)
    {
        // creating element to store a categ with its attributes
        var categName = document.createElement('li');
        var categLink = document.createElement('a');
        //putting data into newly created elements
        categName.appendChild(categLink);
        categLink.setAttribute('href', '../categories/'+jsonData[i].idCategory);
        categLink.textContent = jsonData[i].name;
        //append the new elements into the document (categs div to be specific)
        categList.appendChild(categName);
    }
}
request.send();