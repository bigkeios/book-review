window.onload = function()
{
    // toggle the menu edit/delete
    // get the menu and icon to edit/delete post
    var modifyMenu = document.getElementsByClassName('modifyMenu');
    // get the one of the post div
    var menuPost = modifyMenu.item(0);
    // get the one of the comment div
    var menuCmt = modifyMenu.item(1);
    menuPost.addEventListener('click', toggleMenu);
    menuCmt.addEventListener('click', toggleMenu);
    function toggleMenu(e)
    {
        // evt.target -> menuPost/menuCmt/anything that calls toggleMenu in its eventListener
        // we got clickedIcon bc we clicked on the icon and the id returned is from the icon
        var clickedIcon = document.getElementById(e.target.getAttribute('id'));
        var menu;
        if(clickedIcon.getAttribute('id') === 'menuSelectOnPost')
        {
            menu = document.getElementById('menuOptionsOnPost');
        }
        else if(clickedIcon.getAttribute('id') === 'menuSelectOnCmt')
        {
            menu = document.getElementById('menuOptionsOnCmt');
        }
        try
        {
            // toggle the menu. this only works with inline style somehow
            if(menu.style.display === 'none')
            {
                menu.style.display = 'block';
            }
            else if(menu.style.display === 'block')
            {
                menu.style.display = 'none';
            }
        }
        catch(TypeError)
        {
            console.log("TypeError caught");
        }
    }
    // confirmation window on clicking delete
    // get delete option
    var deleteOption = document.getElementsByClassName('deleteOption');
    // get the delete option in the post div
    deleteOption.item(0).addEventListener('click', alertDelete);
    // get the delete option in the comment div
    deleteOption.item(1).addEventListener('click', alertDelete);
    function alertDelete(e)
    {
        // e plays the same role as in toggleMenu
        // get the id of the option to know where it is from
        var clickedOptionID = e.target.getAttribute('id');
        var eleType;
        if(clickedOptionID === 'deleteOptionOnPost')
        {
            eleType = 'post';
        }
        else if(clickedOptionID === 'deleteOptionOnCmt')
        {
            eleType = 'comment';
        }
        window.confirm('Are you sure you want to delete this ' + eleType);
    }
}
