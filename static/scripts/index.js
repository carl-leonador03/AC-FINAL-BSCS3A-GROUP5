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
    
    case "hashing":
        document.querySelector('input[type="radio"].rw-ui#hash-button').checked = true;
        document.querySelector('div#tab-name').textContent = "Hashing Functions";
        break;
    
    case "info":
        document.querySelector('input[type="radio"].rw-ui#info-button').checked = true;
        document.querySelector('div#tab-name').textContent = "About the Algorithms";
        break;
    
    case "about":
        document.querySelector('input[type="radio"].rw-ui#about-button').checked = true;
        document.querySelector('div#tab-name').textContent = "About this project";
        break;

    default:
        break;
}

const tabNames = {
    "home": "Home",
    "symmetric": "Symmetric Algorithms",
    "asymmetric": "Asymmetric Algorithms",
    "hashing": "Hashing Functions",
    "info": "About the Algorithms",
    "about": "About this project"
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

document.querySelector('img#hash-button').addEventListener("mouseover", () => showTabName('hashing'));
document.querySelector('img#hash-button').addEventListener("mouseout", () => showTabName(page));
document.querySelector('input[type="radio"].rw-ui#hash-button').addEventListener("click", () => changePage('hashing'));

document.querySelector('img#info-button').addEventListener("mouseover", () => showTabName('info'));
document.querySelector('img#info-button').addEventListener("mouseout", () => showTabName(page));
document.querySelector('input[type="radio"].rw-ui#info-button').addEventListener("click", () => changePage('info'));

document.querySelector('img#about-button').addEventListener("mouseover", () => showTabName('about'));
document.querySelector('img#about-button').addEventListener("mouseout", () => showTabName(page));
document.querySelector('input[type="radio"].rw-ui#about-button').addEventListener("click", () => changePage('about'));

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
        
        case "hashing":
            window.location = "/hash";
            break;
        
        case "info":
            window.location = "/info";
            break;
        
        case "about":
            window.location = "/about";
            break;
        
        default:
            break;
    }
}