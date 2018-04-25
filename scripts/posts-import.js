var posts = document.getElementsByClassName('posts');
function populatePost(jsonData)
{
    for(var i = 0; i < jsonData.length; ++i)
    {
        // creating div to store a post with its attributes
        var post = document.createElement('div');
        post.setAttribute('class', 'post');
        post.setAttribute('id', jsonData[i].idposts+'');
        var postTitle = document.createElement('h3');
        var detail = document.createElement('h4');
        var postContent = document.createElement('p');
        var readMore = document.createElement('a');
        //putting data into newly created elements
        postTitle.textContent = jsonData[i].title;
        // limit 100 characters to show only preview
        for(var j=0; j < 100; ++j)
        {
            postContent.textContent += jsonData[i].content[j];
        }
        postContent.textContent += "...";
        var dateCreated = new Date(jsonData[i].dateCreated);
        // toDateString returns on date, not specific time
        detail.textContent = 'Posted on ' + dateCreated.toDateString();
        readMore.textContent = 'Read More...';
        readMore.setAttribute('class', 'readMore');
        readMore.setAttribute('href', '../post-view-index/'+jsonData[i].idposts);
        readMore.setAttribute('id', jsonData[i].idposts + '');
        //append the new elements into the document (posts div to be specific)
        // posts is obtained from getElementByClassName so it is a HTMLCollection -> access first elements through item()
        posts.item(0).appendChild(post);
        post.appendChild(postTitle);
        post.appendChild(document.createElement('hr'));
        post.appendChild(detail);
        post.appendChild(postContent);
        post.appendChild(readMore);
    }
}
var pathname = window.location.pathname;
var pathnameSplitted = pathname.split('/');
if(pathnameSplitted[1] == 'categories')
{
    var pageViewedFor = document.getElementById('pageViewedFor');
    // set the title for the page listing posts of a categ
    pageViewedFor.textContent = 'Posts of category';
    var categID = pathnameSplitted[2];
    var categNameRequest = new XMLHttpRequest();
    categNameRequest.open('GET', 'http://localhost:8000/api/categs/'+categID);
    categNameRequest.send();
    categNameRequest.onload = function()
    {
        var categNameResponse = JSON.parse(this.response);
        pageViewedFor.textContent += ' ' + categNameResponse[0].name;
    }
    // request for the posts
    var postRequest = new XMLHttpRequest();
    postRequest.open('GET', 'http://localhost:8000/api/posts/archives/categories/'+categID);
    postRequest.send();
    postRequest.onload = function()
    {
        populatePost(JSON.parse(this.response));
    }
}
else if(pathnameSplitted[1] == 'tags')
{
    var pageViewedFor = document.getElementById('pageViewedFor');
    // set the title for the page listing posts of a tag
    pageViewedFor.textContent = 'Posts of tag';
    var tagID = pathnameSplitted[2];
    var tagNameRequest = new XMLHttpRequest();
    tagNameRequest.open('GET', 'http://localhost:8000/api/tags/'+tagID);
    tagNameRequest.send();
    tagNameRequest.onload = function()
    {
        var tagNameResponse = JSON.parse(this.response);
        pageViewedFor.textContent += ' ' + tagNameResponse[0].name;
    }
    // request for the posts
    var postRequest = new XMLHttpRequest();
    postRequest.open('GET', 'http://localhost:8000/api/posts/archives/tags/'+tagID);
    postRequest.send();
    postRequest.onload = function()
    {
        populatePost(JSON.parse(this.response));
    }
}
else if(pathnameSplitted[1] == 'time')
{
    var pageViewedFor = document.getElementById('pageViewedFor');
    // set the title for the page listing posts of a month in a year
    pageViewedFor.textContent = 'Posts of ';
    var time = pathnameSplitted[2];
    var yearStr = new String;
    for(var i = 0; i < 4; ++i)
    {
        yearStr += time.charAt(i);
    }
    var monthNum = time.charAt(4) + time.charAt(5);
    var monthName;
    switch(monthNum)
    {
        case '01': 
        {
            monthName = 'January';
            break;
        }
        case '02':
        {
            monthName = 'February';
            break;
        }
        case '03':
        {
            monthName = 'March';
            break;
        }
        case '04':
        {
            monthName = 'April';
            break;
        }
        case '05':
        {
            monthName = 'May';
            break;
        }
        case '06':
        {
            monthName = 'June';
            break;
        }
        case '07':
        {
            monthName = 'July';
            break;
        }
        case '08':
        {
            monthName = 'August';
            break;
        }
        case '09':
        {
            monthName = 'September';
            break;
        }
        case '10':
        {
            monthName = 'October';
            break;
        }
        case '11':
        {
            monthName = 'November';
            break;
        }
        case '12':
        {
            monthName = 'December';
            break;
        }
        default:
        {
            monthName = null;
        }
    }
    pageViewedFor += yearStr + ' ' + monthName;
    // request for the posts
    var postRequest = new XMLHttpRequest();
    postRequest.open('GET', 'http://localhost:8000/api/posts/archives/time/'+time);
    postRequest.send();
    postRequest.onload = function()
    {
        populatePost(JSON.parse(this.response));
    }
}
else
{
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:8000/api/posts/');
    request.send();
    request.onload = function()
    {
        var data = JSON.parse(this.response);
        populatePost(data);
    }
}