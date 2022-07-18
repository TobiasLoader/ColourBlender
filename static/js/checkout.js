// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = Stripe(
	'pk_test_51LJzMaAE43t8f8Vwd9V4opGsnZxhD2h2AzmFEZpXbyXYtmDuQaYXANvtAaxymr1R7eabRUmMHEzMb7or3ddFnTyh00YfCKuCOg',{
	locale: 'fr'
});

// tip amount
var tip_amount = 2.50;

var updateStripeTip = function(){}

function initStripePayment(){
	return fetch('/create-intent',{
		method: 'POST',
		headers: {
			'Content-Type':'application/json',
		},
		body: JSON.stringify({
			amount: 100*tip_amount
		}),
	}).then(function(response) {
	  return response.json();
	}).then(function(responseJson) {
	  var clientSecret = responseJson.client_secret;
	  var id = responseJson.id
		
		updateStripeTip = function(){
			fetch('/update-intent/'+id,{
				method: 'POST',
				headers: {
					'Content-Type':'application/json',
				},
				body: JSON.stringify({
					amount: 100*tip_amount,
				}),
			});
		}
		
		const appearance = {		
			variables: {
				// fontFamily: 'JetBrains Mono',
			}
		};
		
	  const options = {
			clientSecret: clientSecret,
			appearance: appearance,
			fonts: [
				// THIS HERE WORKS (!)
				// {cssSrc: 'https://fonts.googleapis.com/css?family=JetBrains+Mono'}
				
				// THIS DOESN'T CURRENTLY SEEM TO WORK (...)
				// {
			  //   family: 'JetBrains Mono',// put jetbrains_url below (on https) + if can get it working...?
				// 	src: 'local(assets/JetBrainsMono-Light.ttf)',
				// 	// src: 'url(https://fonts.googleapis.com/css?family=JetBrains+Mono)',
				// 	weight: '300',
				// }
			],
	  };
	  
	  // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
	  const elements = stripe.elements(options);
	  
		var paymentElement = elements.create('payment');
	  paymentElement.mount('#payment-element');
		
		let prev_window_origin = window.location.origin;
		
	  // Call stripe.confirmCardPayment() with the client secret.
	  const form = document.getElementById('payment-form');
	  form.addEventListener('submit', async (event) => {
			event.preventDefault();
			const {error} = await stripe.confirmPayment({
		  	//`Elements` instance that was used to create the Payment Element
		  	elements,
		  	confirmParams: {
					return_url: urlRedirectWithParams(prev_window_origin+'/coffee'),
		  	},
			});
			if (error) {
		  	// This point will only be reached if there is an immediate error when
		  	// confirming the payment. Show error to your customer (for example, payment
		  	// details incomplete)
		  	const messageContainer = document.querySelector('#error-message');
		  	messageContainer.textContent = error.message;
			} else {
		  	// Your customer will be redirected to your `return_url`. For some payment
		  	// methods like iDEAL, your customer will be redirected to an intermediate
		  	// site first to authorize the payment, then redirected to the `return_url`.
			}
	  });
	});
}
initStripePayment();