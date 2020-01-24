document
.getElementById("redirect-form")
.addEventListener("click", function(event) {
  event.preventDefault();
});

var redirectButton = document.getElementById("redirect-button");

redirectButton.addEventListener("click", function(ev) {
  var publicKey = document.getElementById("public-key").value;
  var checkoutSessionId = document.getElementById("checkout-session").value;

  if (publicKey.length < 1) {
    publicKey= 'pk_test_AnOcpECn5sgSsIWl0lgN4n7d002LJtdPkg'
  } 
  var stripe = Stripe(publicKey);

  stripe.redirectToCheckout({
    sessionId: checkoutSessionId
  }).then(function (result) {
    console.log(result);
  });
  
});
