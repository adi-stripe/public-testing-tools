//Copy-paste your public key here
var stripe = Stripe("pk_test_xxxxxxxxx");
var elements = stripe.elements();
var style = {
  base: {
    fontSize: "16px",
    color: "#32325d",
    width: "400px",
    class: "form-control"
  }
};

// Create an instance of the card Element.
var card = elements.create("card");

// Add an instance of the card Element into the `card-element` <div>.
card.mount("#card-element");

var cardholderName = document.getElementById("cardholder-name");
var cardButton = document.getElementById("card-button");
var clientSecret = cardButton.dataset.secret;

document
  .getElementById("checkout-form")
  .addEventListener("click", function(event) {
    event.preventDefault();
  });

//Elements case
cardButton.addEventListener("click", function(ev) {
  cardButton.disabled = true;
  var error = document.getElementById("card-errors");

  //Step 1: Create Payment Method
  stripe
    .createPaymentMethod("card", card, {
      billing_details: {
        name: customer.name
      }
    })
    .then(function(result) {
      if (result.error) {
        //Error
        error.innerHTML = "Saving your card failed. " + result.error.message;
        cardButton.disabled = false;
      } else {
        //Step 2: Create Subscription
        var payment_method = result.paymentMethod.id;

        async function getSubscription(payment_method) {
          let response = await fetch(`/charge_pm/${payment_method}`, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            }
          });
          let subscription = await response.json();
          console.log(subscription);
          const { pending_setup_intent, status } = subscription;
          //Option 1: Subscription active/trialing and no further action
          if ((status == "active" || status == "trialing") &&
              pending_setup_intent == null
          ) {
            window.location.replace("/success");
          }

          //Option 2: non payment authentication required (trial or metered)
          if (pending_setup_intent) {
            //Check setup intent and handle next action
            const { client_secret, status } = subscription.pending_setup_intent;
            if (status === "requires_action") {
              stripe.handleCardSetup(client_secret).then(function(result) {
                if (result.error) {
                  error.innerHTML = result.error.message;
                } else {
                  window.location.replace("/success");
                }
              });
            } else if (status === "requires_payment_method") {
              error.innerHTML =
                "The payment failed, please try again with a different card.";
            }
            return;
          }

          //Option 3
          if (
            subscription.status == "incomplete" &&
            subscription.latest_invoice.payment_intent.status ==
              "requires_payment_method"
          ) {
            //The payment failed, try again with a different payment method
            error.innerHTML =
              "The payment failed, please try again with a different card.";
          }

          //Option 4
          if (
            subscription.status == "incomplete" &&
            subscription.latest_invoice.payment_intent.status ==
              "requires_action"
          ) {
            //Step 3: Authenticate the card and capture the payment
            stripe
              .handleCardPayment(
                subscription.latest_invoice.payment_intent.client_secret
              )
              .then(function(result) {
                if (result.error) {
                  //Error
                  var error = document.getElementById("card-errors");
                  error.innerHTML =
                    "Saving your card failed. Please try again " +
                    result.error.message;
                } else {
                  window.location.replace("/success");
                }
              });
          } else {
          }
        }

        getSubscription(payment_method).then(function() {
          cardButton.disabled = false;
        });
      }
    });
});

//Mobile Payment case with requestPaymentButton
var paymentRequest = stripe.paymentRequest({
  country: "GB",
  currency: plan.currency,
  total: {
    label: "Demo total",
    amount: plan.amount || 0
  },
  requestPayerName: true,
  requestPayerEmail: true
});

var prButton = elements.create("paymentRequestButton", {
  paymentRequest: paymentRequest
});

// Check the availability of the Payment Request API first.
paymentRequest.canMakePayment().then(function(result) {
  if (result) {
    prButton.mount("#payment-request-button");
  } else {
    document.getElementById("payment-request-button").style.display = "none";
  }
});

paymentRequest.on("paymentmethod", function(ev) {
  async function createSubscription(payment_method) {
    let response = await fetch(`/charge_pm/${payment_method}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    });
    let subscription = await response.json();
    if (subscription && (subscription.status == "active" || subscription.status == "trialing")) {
      ev.complete("success");
      window.location.replace("/success");
    } else {
      ev.complete("fail");
    }
  }

  createSubscription(ev.paymentMethod.id).then(function() {
    cardButton.disabled = false;
  });
});
