from flask import Flask, render_template, jsonify, request
from copyright_years import build_copyright_years
import stripe

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
	return render_template('index.html',copyrightyears=build_copyright_years())

@app.route('/secret')
def secret():
	intent = stripe.PaymentIntent.create(
		amount=30,
		currency='gbp',
		payment_method_types=['card'],
	)
	return jsonify(client_secret=intent.client_secret)
		
# @app.route('/create-payment-intent', methods=['POST'])
# def create_payment():
# 	print(request.data)
# 	try:
# 		data = json.loads(request.data)
# 		# Create a PaymentIntent with the order amount and currency
# 		stripe.PaymentIntent.create(
# 		  amount=1099,
# 		  currency="eur",
# 		  payment_method_types=[
# 			"bancontact",
# 			"card",
# 			"eps",
# 			"giropay",
# 			"ideal",
# 			"p24",
# 			"sepa_debit",
# 			"sofort",
# 		  ],
# 		)
# 		return jsonify({
# 			'clientSecret': intent['client_secret']
# 		})
# 	except Exception as e:
# 		return jsonify(error=str(e))

if __name__ == "__main__":
	app.run()