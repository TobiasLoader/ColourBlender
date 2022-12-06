""" INFO:
  if the virtual env not running:
    - navigate to /colour_blender_app
    - run: source venv/bin/activate
  to test locally (running flask backend):
    - navigate to /ColourBlender folder in terminal
    - run: python run.py (or gunicorn run:app)
    - go to http://localhost:5000 (or port number)
"""


"""
	TODO - natural extensions:
		- build in options for multiple blending modes: eg: rgb, hsl...
"""

from flask import Flask, render_template, jsonify, request
from copyright_years import build_copyright_years
import stripe
import json
# from flask_ngrok import run_with_ngrok

# This is your test secret API key.
#sk_test_51LJzMaAE43t8f8VwHSiFCcHigSL0E4vC6Zvv35z9PJya75YYDcGLsAPRWgbpo5mnoxaoLnNm5fFG7XyYrKOxoTMj00MKqMaqsx

f = open("/Users/Toby/project-disk-data/ColourBlender/key.txt", "r")
stripe.api_key = f.read();

app = Flask(__name__, static_folder='static', static_url_path='')
# run_with_ngrok(app)

@app.route('/')
def index():
	data = {
		'col1': request.args.get('col1', default = '60c36f', type = str),
		'col2': request.args.get('col2', default = '5382c9', type = str),
		'split': request.args.get('split', default = 0.5, type = float),
		'encode': request.args.get('encode', default = 'hex', type = str),
		'page': request.args.get('page', default = 'home', type = str),
		'years': build_copyright_years()
	}
	return render_template('index.html',data=data)

@app.route('/coffee')
def coffee():
	data = {
		'col1': request.args.get('col1', default = '60c36f', type = str),
		'col2': request.args.get('col2', default = '5382c9', type = str),
		'split': request.args.get('split', default = 0.5, type = float),
		'encode': request.args.get('encode', default = 'hex', type = str),
		'page': 'coffee',
		'years': build_copyright_years()
	}
	return render_template('coffee.html',data=data)

@app.route('/create-intent',methods=['POST'])
def secret():
	data = json.loads(request.data)
	print(data)
	intent = stripe.PaymentIntent.create(
		amount=data['amount'],
		currency='gbp',
		payment_method_types=["card"],
		# automatic_payment_methods=True,
	)
	return jsonify(client_secret=intent.client_secret,id=intent.id)

@app.route('/update-intent/<string:id>',methods=['POST'])
def update_intent(id):
	data = json.loads(request.data)
	try:
			payment_intent = stripe.PaymentIntent.modify(
					id,
					amount=data['amount'],
			)
			return jsonify({'paymentIntent': payment_intent})
	except Exception as e:
			return jsonify(e), 403

if __name__ == "__main__":
	app.run()
