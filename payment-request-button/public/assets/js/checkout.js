var stripe = Stripe("pk_test_AnOcpECn5sgSsIWl0lgN4n7d002LJtdPkg");


var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);


var paymentRequest = stripe.paymentRequest({
  country: 'US',
  currency: 'usd',
  total: {
    label: 'Demo total',
    amount: 1099,
  },
  requestPayerName: true,
  requestPayerEmail: true,
});

// Check the availability of the Payment Request API first.
paymentRequest.canMakePayment().then(function(result) {
  if (result) {
    console.log(result);
    if (isChrome) {
      var paymentsClient = new google.payments.api.PaymentsClient({environment: 'TEST'});
      var gPayButton = paymentsClient.createButton({
        onClick: () => paymentRequest.show(),
        buttonColor: 'black', // black (default) | while
        buttonType: 'long', // long (default) | short
      });
      document.getElementById('payment-request-button').appendChild(gPayButton);
    } else {
      var elements = stripe.elements();
      var prButton = elements.create('paymentRequestButton', {
        paymentRequest: paymentRequest,
      });
      prButton.mount('#payment-request-button');
    }
  } else {
    document.getElementById('payment-request-button').style.display = 'none';
  }
});


this.paymentRequest
.canMakePayment()

.then((response) => {
        // Since we use a custom query strategy, as long as
        // canMakePayment does not resolve to null, we should render
        // the button.
        if (response) {
          this.setState({
            canMakePayment: true,
          });
          if (response.applePay) {
            logger.log('apple_pay_button.displayed');
            this.backingLibrary = 'apple-pay';
          } else if (response.googlePay) {
            logger.log('google_pay_button.displayed');
            this.backingLibrary = 'google-pay';
          }
        }
      });


paymentRequest.on('paymentmethod', function(ev) {
  // Confirm the PaymentIntent without handling potential next actions (yet).
  stripe.confirmCardPayment(
    clientSecret,
    {payment_method: ev.paymentMethod.id},
    {handleActions: false}
    ).then(function(confirmResult) {
      if (confirmResult.error) {
      // Report to the browser that the payment failed, prompting it to
      // re-show the payment interface, or show an error message and close
      // the payment interface.
      ev.complete('fail');
    } else {
      // Report to the browser that the confirmation was successful, prompting
      // it to close the browser payment method collection interface.
      ev.complete('success');
      // Let Stripe.js handle the rest of the payment flow.
      stripe.confirmCardPayment(clientSecret).then(function(result) {
        if (result.error) {
          // The payment failed -- ask your customer for a new payment method.
        } else {
          // The payment has succeeded.
        }
      });
    }
  });
  });
