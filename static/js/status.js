// Retrieve the "payment_intent_client_secret" query parameter appended to
// your return_url by Stripe.js
const clientSecret = new URLSearchParams(window.location.search).get(
  'payment_intent_client_secret'
);

if (clientSecret!=null) {
	// Retrieve the PaymentIntent
	stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent}) => {
  	const message = $('#payment-message')
		message.css('display','block');
		// Inspect the PaymentIntent `status` to indicate the status of the payment
		// to your customer.
		//
		// Some payment methods will [immediately succeed or fail][0] upon
		// confirmation, while others will first enter a `processing` state.
		//
		// [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
		switch (paymentIntent.status) {
			case 'succeeded':
  				message.html('Success! Payment of £'+parseFloat(paymentIntent.amount/100).toFixed(2).toString()+' received.<br><br>Click <a href="'+window.location.origin+'">here</a> to return to the home page.');
					$('#choose-amount-section').css('display','none');
					$('#donate-content > h2').text("Thank-you for tipping! You're amazing :)");
					$('#donate-content > .desc').text("With your help I'll be able to fuel myself to build more great apps for you to use & enjoy.");
  				break;
			case 'processing':
  				message.text("Payment processing. We'll update you when payment is received.");
  				break;
			case 'requires_payment_method':
  				message.text('Payment failed. Please try another payment method.<br><br>Click <a href="'+window.location.origin+'/coffee">here</a> to try again.');
				  $('#choose-amount-section').css('display','none');
  				// Redirect your user back to your payment page to attempt collecting
  				// payment again
  				break;
			default:
  				message.text('Something went wrong.');
  				break;
		}
	});
}