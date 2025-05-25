document.querySelector('input[type="radio"][name="algo-type"].rw-ui#sym-button').checked = true;
document.querySelector('input[type="radio"].rw-ui#des-button').checked = true;

const algoBars = {
    "sym": "sym-bar",
    "asym": "asym-bar",
    "hash": "hash-bar"
}

const algo = ["des", "aes", "bf", "idea", "rsa", "ecc", "sha1", "sha256", "sha3-256", "md5", "blake2", "gost"];

function initButtons()
{
    document.querySelector('input[type="radio"][name="algo-type"].rw-ui#sym-button').addEventListener("click", () => switchTab("sym"));
    document.querySelector('input[type="radio"][name="algo-type"].rw-ui#asym-button').addEventListener("click", () => switchTab("asym"));
    document.querySelector('input[type="radio"][name="algo-type"].rw-ui#hash-button').addEventListener("click", () => switchTab("hash"));

    // A for loop did not give happy results just to merely initialize the tab buttons for the algorithms :(
    document.querySelector('input[type="radio"].rw-ui#des-button').addEventListener("click", () => switchAlgo("des"));
    document.querySelector('input[type="radio"].rw-ui#aes-button').addEventListener("click", () => switchAlgo("aes"));
    document.querySelector('input[type="radio"].rw-ui#bf-button').addEventListener("click", () => switchAlgo("bf"));
    document.querySelector('input[type="radio"].rw-ui#idea-button').addEventListener("click", () => switchAlgo("idea"));
    document.querySelector('input[type="radio"].rw-ui#rsa-button').addEventListener("click", () => switchAlgo("rsa"));
    document.querySelector('input[type="radio"].rw-ui#ecc-button').addEventListener("click", () => switchAlgo("ecc"));
    document.querySelector('input[type="radio"].rw-ui#sha1-button').addEventListener("click", () => switchAlgo("sha1"));
    document.querySelector('input[type="radio"].rw-ui#sha256-button').addEventListener("click", () => switchAlgo("sha256"));
    document.querySelector('input[type="radio"].rw-ui#sha3-256-button').addEventListener("click", () => switchAlgo("sha3-256"));
    document.querySelector('input[type="radio"].rw-ui#md5-button').addEventListener("click", () => switchAlgo("md5"));
    document.querySelector('input[type="radio"].rw-ui#blake2-button').addEventListener("click", () => switchAlgo("blake2"));
    document.querySelector('input[type="radio"].rw-ui#gost-button').addEventListener("click", () => switchAlgo("gost"));
}

initButtons();

function switchTab(t) {
    for (var algobar of Object.keys(algoBars))
    {
        if (algobar == t)
            document.querySelector("#" + algoBars[algobar]).style.display = null;
        else
            document.querySelector("#" + algoBars[algobar]).style.setProperty("display", "none", "important");
    }
}

function switchAlgo(a) {
    for (var al of algo)
    {
        console.log(al);
        if (al == a)
        {
            document.querySelector("div#" + al + "-info").style.display = null;
        }
        else
        {
            document.querySelector("div#" + al + "-info").style.display = "none";
        }
    }
}

async function fun() {
    document.querySelector("#machine-animation").style.display = "flex";
    await setTimeout(() => document.querySelector("#machine-animation").style.display = "none", Math.floor(Math.random() * (3000 - 500 + 1)) + 500);
}

function loopFun() {
    var loop = function() {
        fun();
        setTimeout(loop, Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000);
    }; loop();
}

switchTab("sym");
switchAlgo("des");
loopFun();
