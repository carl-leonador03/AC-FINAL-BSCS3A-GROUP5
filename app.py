from flask import Flask, render_template, url_for, request, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/sym")
def sym():
    return render_template("symmetric.html")

@app.route("/sym/encrypt", methods = ['POST'])
def sym_encrypt():
    if request.method == "POST":
        # request.form was empty for some reason
        form = request.get_json(force = True)
        match form['tab-menu']:
            case "des":
                if form['input-type'] == 'file':
                    return jsonify({"status": "file received"})
                else:
                    return jsonify({"status": "text received", "text": form['text-input-textbox']})

            case _:
                return jsonify({"status": "burger"})

@app.route("/asym")
def asym():
    return render_template("asymmetric.html")

@app.route("/hash")
def hash():
    return render_template("hashing.html")

app.run(debug=True)