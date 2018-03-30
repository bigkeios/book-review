window.onload = function()
{
    var categsSelect = document.getElementById('categoriesSelect');
    var request = new XMLHttpRequest();
    request.open('GET','http://localhost:8000/api/categs');
    request.onload = function()
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
    request.send();
}