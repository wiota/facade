import os
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
  return "<p style='display:block;width: auto;color:#43bf78;font-size: 20px; padding: 10px; margin: 0; border-width: 0 0 1px;z-index:1000;font-family: \"Helvetica Neue\", \"Arial\", \"san-serif\";'><a style='color:#43bf78' href='/joke'>Click Here Dustin!!</a></p>"


@app.route('/joke/')
def joke():
  return "<p style='width: auto;color:#BF5A43;font-size: 20px; padding: 10px; margin: 0; border-width: 0 0 1px;z-index:1000;font-family: \"Helvetica Neue\", \"Arial\", \"san-serif\";' >A barber, a bald man and an absent minded professor take a journey together. They have to camp overnight, so decide to take turns watching the luggage. When it's the barber's turn, he gets bored, so amuses himself by shaving the head of the professor. When the professor is woken up for his shift, he feels his head, and <a style='color:#43bf78;' href='/punchline'>says...</a></p>"

@app.route('/punchline/')
def punchline():
  return "<p style='width: auto;color:#BF5A43;font-size: 20px; padding: 10px; margin: 0; border-width: 0 0 1px;z-index:1000;font-family: \"Helvetica Neue\", \"Arial\", \"san-serif\";' > \"How stupid is that barber? He's woken up the bald man instead of me.\" <a style='color:#43bf78;' href='/'>ha ha</a></p>"


if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)