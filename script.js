function clearResult () {
    document.getElementById('result').remove();
}

function changeMode () {
    
    const elems = document.getElementsByClassName('light');
    const icons = document.getElementsByClassName('icon')

    for (e of Array.from(elems)) {
        e.classList.toggle('dark')
    }

    for (icon of Array.from(icons)){
        icon.classList.toggle('dark')
    }

    document.getElementsByTagName('body')[0].classList.toggle('dark-sec')
    document.getElementsByClassName('stats')[0].classList.toggle('dark-sec')
}

const modeButton = document.getElementById('mode');


modeButton.onclick = () => {
    modeButton.classList.toggle('dark-btn');
    modeButton.classList.toggle('light-btn');
    
    if (modeButton.textContent == "light") {
        modeButton.textContent = "dark"
    } else {
        modeButton.textContent = "light"
    }
    changeMode();
}


async function getDev () {
   
    const query = document.getElementById('search').value;

    try {
        console.log(query)
        await fetch(`https://api.github.com/users/${query}`, {method: "GET"})
            .then(response => {
                if(response.status > 400) {
                    
                    showError()
                    throw "user not found"
                }
                hideError(response)
                return response.json()
            })
            .then(data => {
                
                createResult(data)
            })
    } catch (error) {
        console.log("Error", error)
    }
}

function createResult (data) {

    document.getElementById('avatar').innerHTML = `<img src=${data.avatar_url}>`;
    document.getElementById('avatar-mob').innerHTML = `<img src=${data.avatar_url}>`;
    document.getElementById('name').textContent = data.login;
    document.getElementById('joined').textContent = "Joined " + parseDate(data.created_at);
    document.getElementsByClassName('handler')[0].textContent = "@" + data.login;
    document.getElementById('bio').textContent = data.bio ? data.bio : "This profile has no bio";
    document.getElementById('repos').children[1].textContent = data.public_repos;
    document.getElementById('followers').children[1].textContent = data.followers;
    document.getElementById('following').children[1].textContent = data.following;
    document.getElementById('loc').textContent = data.location ? data.location : "Not Available";
    document.getElementById('twitter').textContent = data.twitter_username ? data.twitter_username : "Not Available";
    document.getElementById('link').textContent = data.blog ? data.blog : data.html_url;
    document.getElementById('link').setAttribute('src', data.blog ? data.blog : data.html_url)
    document.getElementById('company').textContent = data.company ?  data.company : "Not Available"

    document.getElementById('result').classList.remove('hide')

    let items = document.getElementsByClassName('add-info')[0].children;

    for (item of Array.from(items)) {
        if (item.children[1].textContent == "Not Available") {
            item.classList.add('not')
        } else {
            item.classList.remove('not')
        }

        
    }

}

function parseDate (date) {

    const months = {
        0 : 'Jan',
        1 : 'Feb',
        2 : 'Mar',
        3 : 'Apr',
        4 : 'May',
        5 : 'Jun',
        6 : 'Jul',
        7 : 'Aug',
        8 : 'Sep',
        9 : 'Oct',
        10 : 'Nov',
        11 : 'Dec'
    }
    
    let data = new Date(date);
    return `${data.getDay()} ${months[data.getMonth()]} ${data.getFullYear()}`
    
}

function hideError (response) {
    if (response.status < 400 && document.getElementById('error')) document.getElementById('error').remove()
}

function showError () {
    
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "No results";
    errorMsg.classList.add('error');
    errorMsg.id = "error";
    document.getElementsByClassName('search-wrapper')[0].appendChild(errorMsg);
    
}

document.getElementById('submit').onclick = getDev;
document.getElementById('search').onkeydown = (e) => {

    if(e.key == "Enter") {
        getDev()
    }
}