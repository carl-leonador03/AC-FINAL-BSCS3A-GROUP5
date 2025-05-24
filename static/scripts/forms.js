document.querySelector('input[type="radio"].rw-ui#text-input').addEventListener("click", () => switchInput("text"));
document.querySelector('input[type="radio"].rw-ui#file-input').addEventListener("click", () => switchInput("file"));

document.querySelector('div#rw-file-picker button').addEventListener("click", (e) => filePickerClick(e));
document.querySelector('div#rw-file-picker input[type="file"]').addEventListener("change", (e) => filePickerChange(e));

document.querySelector('form#cryptic-form').addEventListener("submit", (e) => encryptDecryptInput(e));

document.querySelector("div#result-note").style.display = "none";
document.querySelector("div#result-text-div").style.display = "none";
document.querySelector("div#result-file-div").style.display = "none";

document.querySelector('button#copy-button').addEventListener("click", (e) => copyText(e));
document.querySelector('button#download-button').addEventListener("click", (e) => document.querySelector("a#hidden-anchor").click());

