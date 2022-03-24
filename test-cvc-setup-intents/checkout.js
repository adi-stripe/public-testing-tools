var stripe = Stripe('pk_test_AnOcpECn5sgSsIWl0lgN4n7d002LJtdPkg');
var elements = stripe.elements();

var cardCvcElement = elements.create("cardCvc");
cardCvcElement.mount("#cvc-element");

const form = document.getElementById('payment-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const {error} = await stripe.confirmCardSetup('seti_1Kgy6KKSM3YgOnvFYF3W0x4e_secret_LNjZU6KVkz8ACB2H81AcMqkYunjhEpj', {
    payment_method: 'pm_1Kgy4XKSM3YgOnvFMiPykbAf',
    payment_method_options: {
      card: {
        cvc: cardCvcElement
      }
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