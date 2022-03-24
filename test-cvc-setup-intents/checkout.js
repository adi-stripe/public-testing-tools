var stripe = Stripe('pk_test_AnOcpECn5sgSsIWl0lgN4n7d002LJtdPkg');
var elements = stripe.elements();

//mount cvc element
var cvc = elements.create("cardCvc");
cvc.mount("#cvc-element");

//confirm setup intent