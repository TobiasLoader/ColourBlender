from flask import Flask, render_template, jsonify, request
from copyright_years import build_copyright_years
import stripe
import json

# This is your test secret API key.
stripe.api_key = 'sk_test_51LJzMaAE43t8f8VwHSiFCcHigSL0E4vC6Zvv35z9PJya75YYDcGLsAPRWgbpo5mnoxaoLnNm5fFG7XyYrKOxoTMj00MKqMaqsx'

# stripe.PaymentIntent.create(
# 	amount=1099,
# 	currency="eur",
# 	payment_method_types=[
# 		"bancontact",
# 		"card",
# 		"eps",
# 		"giropay",
# 		"ideal",
# 		"p24",
# 		"sepa_debit",
# 		"sofort",
# 	],
# )

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html',copyrightyears=build_copyright_years(),page='home')
	
@app.route('/coffee')
def coffee():
	return render_template('index.html',copyrightyears=build_copyright_years(),page='coffee')

@app.route('/create-intent',methods=['POST'])
def secret():
	data = json.loads(request.data)
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