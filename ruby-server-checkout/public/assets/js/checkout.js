var stripe = Stripe("pk_test_AnOcpECn5sgSsIWl0lgN4n7d002LJtdPkg");

var cardButton = document.getElementById("checkout-button");

cardButton.addEventListener("click", function(ev) {
  var error = document.getElementById("errors-placeholder");
  stripe.redirectToCheckout({
    sessionId: checkout_session_id
  }).then(function (result) {
    if (result.error) {
      error.innerHTML = "Saving your card failed. " + result.error.message;
    } else {
      console.log("your payment went through!");
    }
  });
});
