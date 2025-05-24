document.querySelector('input[type="radio"].rw-ui#text-input').addEventListener("click", () => switchInput("text"));
document.querySelector('input[type="radio"].rw-ui#file-input').addEventListener("click", () => switchInput("file"));

document.querySelector('button#encrypt-button').addEventListener("click", (e) => e.target.form.submitted = "encrypt");
document.querySelector('button#decrypt-button').addEventListener("click", (e) => e.target.form.submitted = "decrypt");

document.querySelector('div#rw-file-picker button').addEventListener("click", (e) => filePickerClick(e));
document.querySelector('div#rw-file-picker input[type="file"]').addEventListener("change", (e) => filePickerChange(e));

document.querySelector('input[type="radio"].rw-ui#des-button').addEventListener("click", () => switchTab("des"));
document.querySelector('input[type="radio"].rw-ui#aes-button').addEventListener("click", () => switchTab("aes"));
document.querySelector('input[type="radio"].rw-ui#bf-button').addEventListener("click", () => switchTab("bf"));
document.querySelector('input[type="radio"].rw-ui#idea-button').addEventListener("click", () => switchTab("idea"));

document.querySelector('form#cryptic-form').addEventListener("submit", (e) => encryptDecryptInput(e));

document.querySelector('button#copy-button').addEventListener("click", (e) => copyText(e));

document.querySelector("div#result-note").style.display = "none";
document.querySelector("div#result-text-div").style.display = "none";
document.querySelector("div#result-file-div").style.display = "none";

document.querySelector('input[type="radio"].rw-ui#des-button').checked = true;

const tabDict = {
    "des": ["des-info", 8, 8, "Insert an 8-byte key"],
    "aes": ["aes-info", 16, 32, "Insert a 16-byte key (up to 32)"],
    "bf": ["bf-info", 32, 56, "Insert a 32-byte key (up to 56)"],
    "idea": ["idea-info", 16, 16, "Insert a 16-byte key"]
}

function switchTab(t) {
    document.querySelector('input[type="radio"].rw-ui#text-input').checked = true;

    if (Object.keys(tabDict).includes(t))
    {

        document.querySelector("#" + tabDict[t][0]).style.display = "flex";
        document.querySelector("input#key-input").setAttribute("minLength", tabDict[t][1]);
        document.querySelector("input#key-input").setAttribute("maxLength", tabDict[t][2]);
        document.querySelector("input#key-input").setAttribute("placeholder", tabDict[t][3]);
    }

    try {
        for (var divInfo of Object.keys(tabDict))
        {
            if (divInfo != t)
            {
                document.querySelector("#" + tabDict[divInfo][0]).style.display = "none";
            }
        }
    } catch (err) {
        return;
    }
}

const inputDict = {
    "text": "text-input-form",
    "file": "file-input-form"
}

function switchInput(i) {
    if (Object.keys(inputDict).includes(i))
    {
        document.querySelector("#" + inputDict[i]).style.display = "flex";
    }

    try {
        for (var form of Object.keys(inputDict))
        {
            if (form != i)
            {
                document.querySelector("#" + inputDict[form]).style.display = "none";
            }
        }
    } catch (err) {
        return;
    }
}

function humanFileSize(size) {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return +((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

function b64toBlob(b64Data, contentType='', sliceSize=512)
{
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (offset = 0; offset < byteCharacters.length; offset += sliceSize)
    {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);

        for (i = 0; i < slice.length; i++)
        {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

async function encryptDecryptInput(e) {
    e.preventDefault();
    const mode = e.target.submitted;

    document.querySelector("#the-machine").scrollIntoView({behavior: "smooth"});
    document.querySelector("div#result-note").style.display = "none";
    document.querySelector("div#result-text-div").style.display = "none";
    document.querySelector("div#result-file-div").style.display = "none";

    console.log(e);

    setTimeout(() => document.querySelector("#machine-animation").style.display = "flex", 500);
    var formInput = {};

    for (var entry of new FormData(e.target).entries())
    {
        if (entry[0] == 'file-input' && entry[1].name != "")
        {
            document.querySelector("div#status-text").textContent = "PREPARING FILE FOR UPLOAD";

            const fileBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(",")[1]);
                reader.onerror = reject;
                reader.readAsDataURL(entry[1]);
            });

            formInput[entry[0]] = fileBase64;
            formInput['file-type'] = entry[1].type;
            formInput['file-name'] = entry[1].name;
        }

        else
        {
            formInput[entry[0]] = entry[1];
        }
    }

    formInput['process-type'] = mode;

    if (formInput['input-type'] == "file")
    {
        const request = new XMLHttpRequest();

        var result = await new Promise((resolve) => {
            request.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    if (event.loaded != event.total)
                        document.querySelector("div#status-text").textContent = "UPLOADING FILE: " + Math.round(event.loaded / event.total * 100) + "%";
                    else
                        document.querySelector("div#status-text").textContent = "FILE UPLOADED";
                }
            });

            request.addEventListener("loadend", () => {
                if (request.readyState == XMLHttpRequest.DONE)
                    resolve(request.response);

            });

            request.open("POST", "/sym", true);
            request.setRequestHeader("Content-Type", "application/json");
            request.send(JSON.stringify(formInput));
        })

        result = JSON.parse(result);
    }
    else // Assuming its a text input
    {
        var result = await fetch(
            "/sym",
            {
                method: "POST",
                body: JSON.stringify(formInput),
                headers : {
                    "Content-Type": "application/json"
                }
            }
        ).then((res) => res.json());
    }

    document.querySelector("div#status-text").textContent = (mode == "encrypt") ? "ENCRYPTING" : "DECRYPTING";

    console.log(result);

    if (result != null)
    {
        if (result['status'] == 'error')
        {
            await setTimeout(
                () => {
                    document.querySelector("div#status-text").textContent = "ERROR";
                    document.querySelector("div#status-text").style = null;
                    document.querySelector("div#result-text-div").style.display = "flex";
                    document.querySelector("textarea#result-textbox").value = result['message'];
                    document.querySelector("div#result-note").style.display = "block";
                    document.querySelector("div#result-note").textContent = "An error occurred. Please check the following output for an error message, and report any bugs to the GitHub repository (can be found under About this Project tab).";
                    document.querySelector("#machine-animation").style.display = "none";
                }, 1000
            );
        }
        else
        {    
            if (formInput['input-type'] == "text")
            {
                var resultText = document.querySelector("textarea#result-textbox");

                if (resultText.textContent != "")
                {
                    resultText.value = "";
                } else {
                    resultText.value = result['text'];
                }

                await setTimeout(
                    () => {
                        document.querySelector("div#status-text").textContent = "RESULTS";
                        document.querySelector("div#status-text").style = null;
                        document.querySelector("div#result-text-div").style.display = "flex";
                        document.querySelector("div#result-note").style.display = "block";
                        document.querySelector("#machine-animation").style.display = "none";
                    }, 1000
                );
            }
            else if (formInput['input-type'] == "file")
            {
                var resultAnchor = document.querySelector("a#hidden-anchor");
                var blobbed = b64toBlob(result['file'], formInput['file-type'])

                resultAnchor.href = URL.createObjectURL(blobbed);

                resultAnchor.download = formInput['tab-menu'] + (mode == 'encrypt') ? "_encrypted_" : "_decrypted_" + formInput['file-name'];

                await setTimeout(
                    () => {
                        document.querySelector("div#status-text").textContent = "RESULTS";
                        document.querySelector("div#status-text").style = null;
                        document.querySelector("div#result-file-div").style.display = "flex";
                        document.querySelector("button#download-button").textContent = "DOWNLOAD (" + humanFileSize(blobbed.size) + ") [" + ((mode == 'encrypt') ? "ENCRYPTED" : "DECRYPTED") + "]";
                        document.querySelector("#machine-animation").style.display = "none";
                    }, 1000
                );
            }
        }
    }
}

function filePickerClick(e) {
    var file_picker = e.target.parentElement.children[0];
    file_picker.click();
}

function filePickerChange(e) {
    var file_picker = e.target.parentElement.children[0];
    if (file_picker.files[0].size > 104857600)
    {
        document.querySelector("div#rw-file-picker span").textContent = "File too large! (" + humanFileSize(file_picker.files[0].size) + ")";
        file_picker.files[0] = null;
    } else {
        document.querySelector("div#rw-file-picker span").textContent = (file_picker.files[0] != null) ? file_picker.files[0].name + " (" + humanFileSize(file_picker.files[0].size) + ")" : "No file chosen";
    }
}

function copyText(e)
{
    e.target.textContent = "COPIED!";

    navigator.clipboard.writeText(
        document.querySelector("textarea#result-textbox").value
    );

    console.log(e.target);

    setTimeout(() => e.target.style.animation = "fade-out 0.5s linear", 500);

    setTimeout(() => {
        e.target.textContent = "COPY TO CLIPBOARD";
        e.target.style.animation = "fade-in 0.5s linear";
    }, 1000);
}

switchTab("des");
switchInput("text");