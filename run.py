from flask import Flask, render_template, jsonify, request
from copyright_years import build_copyright_years
import stripe
import json

# This is your test secret API key.
stripe.api_key = 'sk_test_51LJzMaAE43t8f8VwHSiFCcHigSL0E4vC6Zvv35z9PJya75YYDcGLsAPRWgbpo5mnoxaoLnNm5fFG7XyYrKOxoTMj00MKqMaqsx'

app = Flask(__name__)

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