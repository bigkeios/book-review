var archiveTimesRequest = new XMLHttpRequest();
archiveTimesRequest.open('GET', 'http://localhost:8000/api/posts/archives/time');
archiveTimesRequest.send();
archiveTimesRequest.onload = function()
{
    var times = JSON.parse(this.response);
    populateTimes(times);
}
function populateTimes(data)
{
    var archives = document.getElementsByClassName('archives');
    var timesList = document.createElement('ul');
    archives.item(0).appendChild(timesList);
    for(dataItem of data)
    {
        var yearMonth = dataItem.yearMonth + '';
        var yearStr = new String;
        for(var i = 0; i < 4; ++i)
        {
            yearStr += yearMonth.charAt(i);
        }
        var monthNum = yearMonth.charAt(4) + yearMonth.charAt(5);
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
        var time = document.createElement('li');
        var timeLink = document.createElement('a');
        time.appendChild(timeLink);
        timeLink.setAttribute('href', '../time/'+yearMonth);
        timeLink.textContent = yearStr + ' ' + monthName;
        timesList.appendChild(time);
    }
}