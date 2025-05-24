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
    
    case "asymmetric":
        document.querySelector('input[type="radio"].rw-ui#asym-button').checked = true;
        document.querySelector('div#tab-name').textContent = "Asymmetric Algorithms";
        break;
    
    default:
        break;
}

const tabNames = {
    "home": "Home",
    "symmetric": "Symmetric Algorithms",
    "asymmetric": "Asymmetric Algorithms",
    "hashing": "Hashing Functions",
    "about": "About the Algorithms",
    "info": "About us"
}

document.querySelector('img#home-button').addEventListener("mouseover", () => showTabName('home'));
document.querySelector('img#home-button').addEventListener("mouseout", () => showTabName(page));
document.querySelector('input[type="radio"].rw-ui#home-button').addEventListener("click", () => changePage('home'));

document.querySelector('img#sym-button').addEventListener("mouseover", () => showTabName('symmetric'));
document.querySelector('img#sym-button').addEventListener("mouseout", () => showTabName(page));
document.querySelector('input[type="radio"].rw-ui#sym-button').addEventListener("click", () => changePage('symmetric'));

document.querySelector('img#asym-button').addEventListener("mouseover", () => showTabName('asymmetric'));
document.querySelector('img#asym-button').addEventListener("mouseout", () => showTabName(page));
document.querySelector('input[type="radio"].rw-ui#asym-button').addEventListener("click", () => changePage('asymmetric'));

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
        
        case "asymmetric":
            window.location = "/asym";
            break;
        
        default:
            break;
    }
}