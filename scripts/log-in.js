window.onload = function()
{
    var logIn = document.getElementById('logIn');
    logIn.onclick = function(e)
    {
        e.preventDefault();
        var logInInfo = 
        {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }
        var logInRequest = new XMLHttpRequest();
        logInRequest.open('POST', 'http://localhost:8000/users/login/');
        logInRequest.setRequestHeader('Content-Type', 'application/json');
        logInRequest.send(JSON.stringify(logInInfo));
        logInRequest.onload = function()
        {
            window.alert("Log in successfully");
        }
    }
}
