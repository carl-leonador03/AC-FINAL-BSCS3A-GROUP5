document.querySelector('input[type="radio"].rw-ui#text-input').addEventListener("click", () => switchInput("text"));
document.querySelector('input[type="radio"].rw-ui#file-input').addEventListener("click", () => switchInput("file"));

document.querySelector('div#rw-file-picker button').addEventListener("click", (e) => filePickerClick(e));
document.querySelector('div#rw-file-picker input[type="file"]').addEventListener("change", (e) => filePickerChange(e));

document.querySelector('input[type="radio"].rw-ui#sha1-button').addEventListener("click", () => switchTab("sha1"));
document.querySelector('input[type="radio"].rw-ui#sha256-button').addEventListener("click", () => switchTab("sha256"));
document.querySelector('input[type="radio"].rw-ui#md5-button').addEventListener("click", () => switchTab("md5"));
document.querySelector('input[type="radio"].rw-ui#blake2-button').addEventListener("click", () => switchTab("blake2"));
document.querySelector('input[type="radio"].rw-ui#sha3-256-button').addEventListener("click", () => switchTab("sha3-256"));
document.querySelector('input[type="radio"].rw-ui#gost-button').addEventListener("click", () => switchTab("gost"));

document.querySelector('form#cryptic-form').addEventListener("submit", (e) => hashInput(e));

document.querySelector('button#copy-button').addEventListener("click", (e) => copyText(e));

document.querySelector("div#result-note").style.display = "none";
document.querySelector("div#result-text-div").style.display = "none";
document.querySelector("div#result-file-div").style.display = "none";

document.querySelector('input[type="radio"].rw-ui#sha1-button').checked = true;

const tabDict = {
    "sha1": "sha1-info",
    "sha256": "sha256-info",
    "md5": "md5-info",
    "blake2": "blake2-info",
    "sha3-256": "sha3-256-info",
    "gost": "gost-info"
}

function switchTab(t) {
    document.querySelector('input[type="radio"].rw-ui#text-input').checked = true;
    switchInput("text");

    if (Object.keys(tabDict).includes(t))
    {

        document.querySelector("#" + tabDict[t]).style.display = "flex";
    }

    try {
        for (var divInfo of Object.keys(tabDict))
        {
            if (divInfo != t)
            {
                document.querySelector("#" + tabDict[divInfo]).style.display = "none";
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

async function hashInput(e) {
    e.preventDefault();

    document.querySelector("#the-machine").scrollIntoView({behavior: "smooth"});
    document.querySelector("div#result-note").style.display = "none";
    document.querySelector("div#result-text-div").style.display = "none";
    document.querySelector("div#result-file-div").style.display = "none";

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

            request.open("POST", "/hash", true);
            request.setRequestHeader("Content-Type", "application/json");
            request.send(JSON.stringify(formInput));
        })

        result = JSON.parse(result);
    }
    else // Assuming its a text input
    {
        var result = await fetch(
            "/hash",
            {
                method: "POST",
                body: JSON.stringify(formInput),
                headers : {
                    "Content-Type": "application/json"
                }
            }
        ).then((res) => res.json());
    }

    document.querySelector("div#status-text").textContent = "HASHING";

    if (result != null)
    {
        {
            var resultText = document.querySelector("textarea#result-textbox");

            if (resultText.textContent != "")
            {
                resultText.value = "";
            } else {
                resultText.value = formInput['input-type'] == "text" ? result['text'] : result['file'];
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

switchTab("sha1");
switchInput("text");