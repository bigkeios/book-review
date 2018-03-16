window.onload = function()
{
    var discard = document.getElementById('discardPost');
    discard.onclick = function()
    {
        window.confirm("Are you sure you want to discard the post?");  
    }
}