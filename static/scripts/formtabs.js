document.querySelector('input[type="radio"].rw-ui#des-button').addEventListener("click", () => switchTab("des"));
document.querySelector('input[type="radio"].rw-ui#aes-button').addEventListener("click", () => switchTab("aes"));
document.querySelector('input[type="radio"].rw-ui#bf-button').addEventListener("click", () => switchTab("bf"));

document.querySelector('input[type="radio"].rw-ui#text-input').addEventListener("click", () => switchInput("text"));
document.querySelector('input[type="radio"].rw-ui#file-input').addEventListener("click", () => switchInput("file"));

document.querySelector('form#cryptic-form').addEventListener("submit", (e) => encryptInput(e));
document.querySelector('div#rw-file-picker button').addEventListener("click", (e) => filePickerClick(e));
document.querySelector('div#rw-file-picker input[type="file"]').addEventListener("change", (e) => filePickerChange(e));

document.querySelector('input[type="radio"].rw-ui#des-button').checked = true;
document.querySelector('input[type="radio"].rw-ui#text-input').checked = true;

const tabDict = {
    "des": "des-form",
    "aes": "aes-form",
    "bf": "bf-form"
}

function switchTab(t) {
    if (Object.keys(tabDict).includes(t))
    {
        document.querySelector("#" + tabDict[t]).style.display = "flex";
    }

    try {
        for (var form of Object.keys(tabDict))
        {
            if (form != t)
            {
                document.querySelector("#" + tabDict[form]).style.display = "none";
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

async function encryptInput(e) {
    e.preventDefault();
    document.querySelector("#the-machine").scrollIntoView({behavior: "smooth"});

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
        }

        else
        {
            formInput[entry[0]] = entry[1];
        }
    }

    console.log(formInput);

    if (formInput['input-type'] == "file")
    {
        const request = new XMLHttpRequest();

        await new Promise((resolve) => {
            request.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    if (event.loaded != event.total)
                        document.querySelector("div#status-text").textContent = "UPLOADING FILE: " + Math.round(event.loaded / event.total * 100) + "%";
                    else
                        document.querySelector("div#status-text").textContent = "FILE UPLOADED";
                }
            });

            request.addEventListener("loadend", () => {
                resolve(request.readyState === 4 && request.status === 200);
            });

            request.open("POST", "/sym/encrypt", true);
            request.setRequestHeader("Content-Type", "application/json");
            request.send(JSON.stringify(formInput));
        })
    }
    else // Assuming its a text input
    {
        await fetch(
            "/sym/encrypt",
            {
                method: "POST",
                body: JSON.stringify(formInput),
                headers : {
                    "Content-Type": "application/json"
                }
            }
        ).then((res) => res.json());
    }

    document.querySelector("div#status-text").textContent = "ENCRYPTING";
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

switchTab("des");
switchInput("text");