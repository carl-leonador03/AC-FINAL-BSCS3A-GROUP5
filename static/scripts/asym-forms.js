document.querySelector('input[type="radio"].rw-ui#gen-keys-button').addEventListener("click", () => switchTab("gen-keys"));
document.querySelector('input[type="radio"].rw-ui#encrypt-button').addEventListener("click", () => switchTab("encrypt"));
document.querySelector('input[type="radio"].rw-ui#decrypt-button').addEventListener("click", () => switchTab("decrypt"));

document.querySelector('button#gen-keys-submit-button').addEventListener("click", () => generateKeys());
document.querySelector('button#copy-public-key').addEventListener("click", (e) => copyKey(e, "public"));
document.querySelector('button#copy-private-key').addEventListener("click", (e) => copyKey(e, "private"));

document.querySelector('input[type="radio"].rw-ui#rsa-button').addEventListener("click", () => switchAlgo("rsa"));
document.querySelector('input[type="radio"].rw-ui#ecc-button').addEventListener("click", () => switchAlgo("ecc"));

document.querySelector('input[type="radio"].rw-ui#gen-keys-button').checked = true;
document.querySelector('input[type="radio"].rw-ui#rsa-button').checked = true;
document.querySelector('input[type="radio"].rw-ui#text-input').checked = true;

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

function switchTab(t) {
    if (t == "gen-keys")
    {
        document.querySelector("div#text-file-form").style.display = "none";
        document.querySelector("div#gen-keys-form").style.display = null;
    }
    else if (t == "encrypt" || t == "decrypt")
    {
        document.querySelector("div#text-file-form").style.display = null;
        document.querySelector("div#gen-keys-form").style.display = "none";

        const key_input = document.querySelector("div.text-input:has(> textarea)");

        if (t == "encrypt")
        {
            key_input.querySelector("textarea").placeholder = "Insert your receipient's public key";
            if (key_input.querySelector("textarea").value != "")
            {
                key_input.querySelector("textarea").value = "";
            }
            document.querySelector("button#process-button").textContent = "ENCRYPT";
        }
        else if (t == "decrypt")
        {
            key_input.querySelector("textarea").placeholder = "Insert your private key";
            if (key_input.querySelector("textarea").value != "")
            {
                key_input.querySelector("textarea").value = "";
            }
            document.querySelector("button#process-button").textContent = "DECRYPT";
        }
    }
}

function switchAlgo(a) {
    if (a == "rsa")
    {
        document.querySelector("div#rsa-info").style.display = null;
        document.querySelector("div#ecc-info").style.display = "none";
    }
    else if (a == "ecc")
    {
        document.querySelector("div#rsa-info").style.display = "none";
        document.querySelector("div#ecc-info").style.display = null;
    }
}

function switchInput(i) {
    if (i == "text")
    {
        document.querySelector("div#text-input-form").style.display = null;
        document.querySelector("div#file-input-form").style.display = "none";
    }
    else if (i == "file")
    {
        document.querySelector("div#text-input-form").style.display = "none";
        document.querySelector("div#file-input-form").style.display = null;
    }
}

async function generateKeys() {
    var algo = new FormData(document.querySelector("form#cryptic-form")).get("algo");
    var result = await fetch(
        "/asym",
        {
            method: "POST",
            body: JSON.stringify({"process": "genkeys", "algo": algo}),
            headers: {
                "Content-Type": "application/json"
            }
        }
    ).then((res) => res.json());

    if (result != null) {
        if (algo == 'ecc')
        {
            document.querySelector("textarea#public-key-textarea").textContent = "-----BEGIN EC PUBLIC KEY-----\n" + result["public-key"] + "\n-----END EC PUBLIC KEY-----\n";
            document.querySelector("textarea#private-key-textarea").textContent = "-----BEGIN EC PRIVATE KEY-----\n" + result["private-key"] + "\n-----END EC PRIVATE KEY-----\n";
        }
        else if (algo == 'rsa')
        {
            document.querySelector("textarea#public-key-textarea").textContent = result["public-key"];
            document.querySelector("textarea#private-key-textarea").textContent = result["private-key"];
        }

        document.querySelector("textarea#public-key-textarea").style.maxHeight = "unset";
        document.querySelector("textarea#public-key-textarea").style.display = "unset";
        document.querySelector("button#copy-public-key").style.display = "unset";

        document.querySelector("textarea#private-key-textarea").style.maxHeight = "unset";
        document.querySelector("textarea#private-key-textarea").style.display = "unset";
        document.querySelector("button#copy-private-key").style.display = "unset";
    }
}

function copyKey(e, k)
{
    e.target.textContent = "COPIED!";

    navigator.clipboard.writeText(
        (k == "private") ? document.querySelector("textarea#private-key-textarea").value : document.querySelector("textarea#public-key-textarea").value
    );

    setTimeout(() => e.target.style.animation = "fade-out 0.5s linear", 500);

    setTimeout(() => {
        e.target.textContent = "COPY TO CLIPBOARD";
        e.target.style.animation = "fade-in 0.5s linear";
    }, 1000);
}

async function encryptDecryptInput(e) {
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

    mode = formInput["process"];
    console.log(formInput);

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

            request.open("POST", "/asym", true);
            request.setRequestHeader("Content-Type", "application/json");
            request.send(JSON.stringify(formInput));
        })

        document.querySelector("div#status-text").textContent = (mode == "encrypt") ? "ENCRYPTING" : "DECRYPTING";

        result = JSON.parse(result);
    }
    else // Assuming its a text input
    {
        document.querySelector("div#status-text").textContent = (mode == "encrypt") ? "ENCRYPTING" : "DECRYPTING";

        var result = await fetch(
            "/asym",
            {
                method: "POST",
                body: JSON.stringify(formInput),
                headers : {
                    "Content-Type": "application/json"
                }
            }
        ).then((res) => res.json());
    }

    if (result != null)
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

            resultAnchor.download = formInput['algo'] + ((formInput['process'] == 'encrypt') ? "_encrypted_" : "_decrypted_") + formInput['file-name'];

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

function filePickerClick(e) {
    var file_picker = e.target.parentElement.children[0];
    file_picker.click();
}

function filePickerChange(e) {
    var file_picker = e.target.parentElement.children[0];
    console.log(file_picker.files[0]);
    document.querySelector("div#rw-file-picker span").textContent = (file_picker.files[0] != null) ? file_picker.files[0].name + " (" + humanFileSize(file_picker.files[0].size) + ")" : "No file chosen";
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

switchTab("gen-keys");
switchAlgo("rsa");
switchInput("text");