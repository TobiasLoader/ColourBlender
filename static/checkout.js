// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = Stripe('pk_test_51LJzMaAE43t8f8Vwd9V4opGsnZxhD2h2AzmFEZpXbyXYtmDuQaYXANvtAaxymr1R7eabRUmMHEzMb7or3ddFnTyh00YfCKuCOg');

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
			})
		}
		
	  const options = {
			clientSecret: clientSecret,
	  };
	  
	  // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
	  const elements = stripe.elements(options);
	  
	  // Create and mount the Payment Element
	  const paymentElement = elements.create('payment');
	  paymentElement.mount('#payment-element');
		
	  // Call stripe.confirmCardPayment() with the client secret.
	  const form = document.getElementById('payment-form');
	  
	  form.addEventListener('submit', async (event) => {
		event.preventDefault();
	  
		const {error} = await stripe.confirmPayment({
		  //`Elements` instance that was used to create the Payment Element
		  elements,
		  confirmParams: {
			return_url: 'http://localhost:5000/coffee?payment_intent_client_secret='+clientSecret,
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