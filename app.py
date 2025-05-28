from flask import Flask, render_template, request, jsonify
from base64 import b64decode, b64encode

from sym import des, aes, blowfish, idea
from asym import rsa, ecc, generate_keys
from hash import sha1, sha256, md5, blake2, sha3_256, gost

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/sym", methods = ['GET', 'POST'])
def sym():
    if request.method == "POST":
        # request.form was empty for some reason
        try:
            form = request.get_json(force = True)
            mode = form['process-type']
            sym_functions = {
                "des": {"encrypt": lambda k, d: des(k, d), "decrypt": lambda k, d: des(k, d, 1)},
                "aes": {"encrypt": lambda k, d: aes(k, d), "decrypt": lambda k, d: aes(k, d, 1)},
                "blowfish": {"encrypt": lambda k, d: blowfish(k, d), "decrypt": lambda k, d: blowfish(k, d, 1)},
                "idea": {"encrypt": lambda k, d: idea(k, d), "decrypt": lambda k, d: idea(k, d, 1)}
            }

            if form['tab-menu'] in list(sym_functions.keys()):
                if form['input-type'] == 'file':
                    # Process file (decode base64-encoded file)
                    file = b64decode(form['file-input'])

                    if mode in ['encrypt', 'decrypt']:
                        processed = sym_functions[form['tab-menu']][mode](form['key-input'].encode(), file)
                        return jsonify({"status": f"{mode}ed-file", "file": b64encode(processed).decode('ascii')})

                    else:
                        return jsonify({"status": "invalid-mode"})

                else:
                    # Process text
                    if mode in ['encrypt', 'decrypt']:
                        processed = sym_functions[form['tab-menu']][mode](
                            form['key-input'].encode(), 
                            form['text-input-textbox'].encode() if mode == 'encrypt' else b64decode(form['text-input-textbox'].encode())
                        )

                        return jsonify(
                            {
                                "status": f"{mode}ed-text",
                                "text": b64encode(processed).decode('ascii') if mode == 'encrypt' else processed.decode('ascii')
                            }
                        )

                    else:
                        return jsonify({"status": "invalid-mode"})
            
            else:
                return jsonify({"status": "invalid-algorithm"})
        
        except Exception as err:
            return jsonify({"status": "error", "message": str(err)})
        
    return render_template("symmetric.html")

@app.route("/asym", methods = ['GET', 'POST'])
def asym():
    if request.method == "POST":
        # request.form was empty for some reason
        try:
            form = request.get_json(force = True)
            process = form['process']
            algo = form['algo']

            if process == 'genkeys':
                pv, pb = generate_keys(algo)
                return jsonify({"status": "keys-generated",
                                "public-key": (b64encode(pb) if algo == 'ecc' else pb).decode("ascii"),
                                "private-key": (b64encode(pv) if algo == 'ecc' else pv).decode("ascii")
                                })

            elif process == "encrypt" or process == "decrypt":
                key = form['key-input']

                if algo == "ecc":
                    if "PUBLIC" in key:
                        key = key.replace("-----BEGIN EC PUBLIC KEY-----\n", "")
                        key = key.replace("\n-----END EC PUBLIC KEY-----\n", "")
                    elif "PRIVATE" in key:
                        key = key.replace("-----BEGIN EC PRIVATE KEY-----\n", "")
                        key = key.replace("\n-----END EC PRIVATE KEY-----\n", "")
                    key = b64decode(key)

                    if form['input-type'] == 'file':
                        file = b64decode(form['file-input'])

                        if process == "encrypt":
                            encrypted = ecc(key, file)
                            return jsonify(
                                {
                                    "status": "encrypted-file",
                                    "file": b64encode(encrypted).decode('ascii')
                                }
                            )
                        
                        elif process == "decrypt":
                            decrypted = ecc(key, file, 1)
                            return jsonify(
                                {
                                    "status": "decrypted-file",
                                    "file": b64encode(decrypted).decode('ascii')
                                }
                            )

                        else:
                            return jsonify({"status": "invalid-process"})
                    
                    else:
                        # Process text
                        if process == "encrypt":
                            encrypted = ecc(key, form['text-input-textbox'].encode())

                            return jsonify(
                                {
                                    "status": "encrypted-text",
                                    "text": b64encode(encrypted).decode('ascii')
                                }
                            )
                        
                        elif process == "decrypt":
                            decrypted = ecc(key, b64decode(form['text-input-textbox'].encode()), 1)

                            return jsonify(
                                {
                                    "status": "decrypted-text",
                                    "text": decrypted.decode('ascii')
                                }
                            )

                        else:
                            return jsonify({"status": "invalid-mode"})

                elif algo == "rsa":
                    if form['input-type'] == 'file':
                        file = b64decode(form['file-input'])

                        if process == "encrypt":
                            encrypted = rsa(key, file)
                            return jsonify(
                                {
                                    "status": "encrypted-file",
                                    "file": b64encode(encrypted).decode('ascii')
                                }
                            )
                        
                        elif process == "decrypt":
                            decrypted = rsa(key, file, 1)
                            return jsonify(
                                {
                                    "status": "decrypted-file",
                                    "file": b64encode(decrypted).decode('ascii')
                                }
                            )

                        else:
                            return jsonify({"status": "invalid-process"})
                    
                    else:
                        # Process text
                        if process == "encrypt":
                            encrypted = rsa(key, form['text-input-textbox'].encode())

                            return jsonify(
                                {
                                    "status": "encrypted-text",
                                    "text": b64encode(encrypted).decode('ascii')
                                }
                            )
                        
                        elif process == "decrypt":
                            decrypted = rsa(key, b64decode(form['text-input-textbox'].encode()), 1)

                            return jsonify(
                                {
                                    "status": "decrypted-text",
                                    "text": decrypted.decode('ascii')
                                }
                            )

                        else:
                            return jsonify({"status": "invalid-process"})
                else:
                    return jsonify({"status": "invalid-algorithm"})
            else:
                return jsonify({"status": "invalid-process"})
        
        except Exception as err:
            return jsonify({"status": "error", "message": str(err)})

    return render_template("asymmetric.html")

@app.route("/hash", methods=['POST', 'GET'])
def hash():
    if request.method == 'POST':
        # request.form was empty for some reason
        try:
            form = request.get_json(force = True)
            hash = form['hash']

            hash_funcs = {
                "sha1": lambda x: sha1(x),
                "sha256": lambda x: sha256(x),
                "md5": lambda x: md5(x),
                "blake2": lambda x: blake2(x),
                "sha3-256": lambda x: sha3_256(x),
                "gost": lambda x: gost(x)
            }
            
            if form['hash'] in list(hash_funcs.keys()):
                if form['input-type'] == 'file':
                    file = b64decode(form['file-input'])
                    hashed = hash_funcs[hash](file)
                    
                    return jsonify({"status": "hashed-file", "file": hashed})
                
                else:
                    # Process text
                    hashed = hash_funcs[hash](form['text-input-textbox'])
                    
                    return jsonify({"status": "hashed-text", "text": hashed})
                
            else:
                return jsonify({"status": "unknown-hash"})
        
        except Exception as err:
            return jsonify({"status": "error", "message": str(err)})

    return render_template("hashing.html")

@app.route("/info")
def info():
    return render_template("info.html")

@app.route("/about")
def about():
    return render_template("about.html")

if __name__ == '__main__':
    app.run(debug=True)