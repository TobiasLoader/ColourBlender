from flask import Flask
from flask import render_template
from copyright_years import build_copyright_years

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html',copyrightyears=build_copyright_years())

if __name__ == "__main__":
	app.run()