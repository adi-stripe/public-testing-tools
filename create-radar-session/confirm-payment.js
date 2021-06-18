var stripe = Stripe('pk_test_AnOcpECn5sgSsIWl0lgN4n7d002LJtdPkg');

function confirmPayment() {
    var pi_secret = document.getElementById("pi_secret").value;
    var pm_id = document.getElementById("pm_id").value;
     
    stripe.confirmCardPayment(pi_secret, {
        payment_method: pm_id
    }).then(function(result) {
        var result_message = document.getElementById("result_message");
        if (result.error) {
            result_message.outerText = result.error
        } else {
            result_message.outerText = "You confirmed " + pi_secret + " with " + pm_id; 
        }
        
    });

  }