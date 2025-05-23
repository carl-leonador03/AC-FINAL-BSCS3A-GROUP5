switch (page)
{
    case "home":
        document.querySelector('input[type="radio"].rw-ui#home-button').checked = true;
        document.querySelector('div#tab-name').textContent = "Home";
        break;
    
    case "symmetric":
        document.querySelector('input[type="radio"].rw-ui#sym-button').checked = true;
        document.querySelector('div#tab-name').textContent = "Symmetric Algorithms";
        break;
    
    default:
        break;
}

const tabNames = {
    "home": "Home",
    "symmetric": "Symmetric Algorithms"
}

document.querySelector('img#home-button').addEventListener("mouseover", () => showTabName('home'));
document.querySelector('img#home-button').addEventListener("mouseout", () => showTabName(page));
document.querySelector('input[type="radio"].rw-ui#home-button').addEventListener("click", () => changePage('home'));
document.querySelector('img#sym-button').addEventListener("mouseover", () => showTabName('symmetric'));
document.querySelector('img#sym-button').addEventListener("mouseout", () => showTabName(page));
document.querySelector('input[type="radio"].rw-ui#sym-button').addEventListener("click", () => changePage('symmetric'));

function showTabName(p)
{
    document.querySelector('div#tab-name').textContent = tabNames[p];
}

function changePage(p) {
    switch (p)
    {
        case "home":
            window.location = "/";
            break;
        
        case "symmetric":
            window.location = "/sym";
            break;
        
        default:
            break;
    }
}