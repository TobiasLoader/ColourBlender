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
		- build in options for multiple blending modes: eg: rgb, hsl, lch...
		- accounts to save colour palettes
"""

from flask import Flask, render_template, jsonify, request
from copyright_years import build_copyright_years
import stripe
import json
# from flask_ngrok import run_with_ngrok

# This is TEST secret API key.
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

## usage analytics collected by me

class Analytics:
	def __init__(self,write_bucket_size):
		self.file = "/Users/Toby/project-disk-data/ColourBlender/analytics.json"
		self.write_bucket_size = write_bucket_size
		self.analytics_fivesec = 0
		self.analytics_thirtysec = 0
		self.analytics_sliderchange = 0
		self.analytics_colourchange = 0
		self.analytics_hexrgbtoggle = 0
		self.analytics_coffeevisits = 0
		self.update_changes = 0
		self.analytics_read()
	def analytics_read(self):
		analyticsReadFile = open(self.file, "r")
		analyticsRead = json.load(analyticsReadFile)
		analyticsReadFile.close()
		if "fivesec" in analyticsRead:
			self.analytics_fivesec = analyticsRead["fivesec"]
		if "thirtysec" in analyticsRead:
			self.analytics_thirtysec = analyticsRead["thirtysec"]
		if "sliderchange" in analyticsRead:
			self.analytics_sliderchange = analyticsRead["sliderchange"]
		if "colourchange" in analyticsRead:
			self.analytics_colourchange = analyticsRead["colourchange"]
		if "hexrgbtoggle" in analyticsRead:
			self.analytics_hexrgbtoggle = analyticsRead["hexrgbtoggle"]
		if "coffeevisits" in analyticsRead:
			self.analytics_coffeevisits = analyticsRead["coffeevisits"]
		self.write()
	def update(self):
		# self.output()
		self.update_changes += 1
		if self.update_changes>=self.write_bucket_size:
			self.write()
			self.update_changes = 0
	def update_fivesec(self):
		self.analytics_fivesec += 1
		self.update()
	def update_thirtysec(self):
		self.analytics_thirtysec += 1
		self.update()
	def update_sliderchange(self):
		self.analytics_sliderchange += 1
		self.update()
	def update_colourchange(self):
		self.analytics_colourchange += 1
		self.update()
	def update_hexrgbtoggle(self):
		self.analytics_hexrgbtoggle += 1
		self.update()
	def update_coffeevisits(self):
		self.analytics_coffeevisits += 1
		self.update()
	def write(self):
		analyticsWriteFile = open(self.file, "w+")
		analyticsWriteFile.write(json.dumps({
			'fivesec':self.analytics_fivesec,
			'thirtysec':self.analytics_thirtysec,
			'sliderchange':self.analytics_sliderchange,
			'colourchange':self.analytics_colourchange,
			'hexrgbtoggle':self.analytics_hexrgbtoggle,
			'coffeevisits':self.analytics_coffeevisits,
		}))
		analyticsWriteFile.close()
		print('=> written to analytics file:')
		self.output()
	def output(self):
		print('fivesec',self.analytics_fivesec)
		print('thirtysec',self.analytics_thirtysec)
		print('sliderchange',self.analytics_sliderchange)
		print('colourchange',self.analytics_colourchange)
		print('hexrgbtoggle',self.analytics_hexrgbtoggle)
		print('coffeevisits',self.analytics_coffeevisits)
		print('~~~')

# the 10 indicates it will collect 10 new analytics updates before writing them all to the json file
analytics = Analytics(10)

@app.route('/analytics/fivesec',methods=['POST'])
def update_analytics_fivesec():
	analytics.update_fivesec()
	return jsonify({'success':True})

@app.route('/analytics/thirtysec',methods=['POST'])
def update_analytics_thirtysec():
	analytics.update_thirtysec()
	return jsonify({'success':True})

@app.route('/analytics/sliderchange',methods=['POST'])
def update_analytics_sliderchange():
	analytics.update_sliderchange()
	return jsonify({'success':True})

@app.route('/analytics/colourchange',methods=['POST'])
def update_analytics_colourchange():
	analytics.update_colourchange()
	return jsonify({'success':True})

@app.route('/analytics/hexrgbtoggle',methods=['POST'])
def update_analytics_hexrgbtoggle():
	analytics.update_hexrgbtoggle()
	return jsonify({'success':True})
	
@app.route('/analytics/coffeevisits',methods=['POST'])
def update_analytics_coffeevisits():
	analytics.update_coffeevisits()
	return jsonify({'success':True})


if __name__ == "__main__":
	app.run()
