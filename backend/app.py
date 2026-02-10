from flask import Flask, render_template, jsonify
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static"),
)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/next/<int:step>")
def next_message(step):
    messages = {
        1: "Hii my baby xD",
        2: "I wanted to do something a little special :p",
        3: "Something you might likee :3",
        4: "Because you genuinely matter to me <3",
        5: "So I have one question…",
        6: "Will you be my Valentine? <3",
    }
    return jsonify({"message": messages.get(step, "")})

@app.route("/love-letter")
def love_letter():
    return render_template("love_letter.html")

# old routes (safe to keep)
@app.route("/game/heartcatch")
def heartcatch():
    return render_template("heartcatch.html")

@app.route("/play")
def play():
    return render_template("play.html")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
