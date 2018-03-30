window.onload = function()
{
    var readMore = document.getElementsByClassName('readMore');
    for(var i = 0; i < readMore.length; ++i)
    {
        readMore.item(i).addEventListener('click', redirect);
        console.log(readMore.item(i).getAttribute('id'));
    }
    
}
