var stripe = Stripe('pk_test_AnOcpECn5sgSsIWl0lgN4n7d002LJtdPkg',
                {canCreateRadarSession: true});
var radar_session;

function confirmPayment() {
    var pi_secret = document.getElementById("pi_secret").value;
    var pm_id = document.getElementById("pm_id").value;

    stripe.createRadarSession().then(function(result) {
        if (result.error) {
          // Typically you should not abort your checkout flow if an error is returned.
          console.error(result.error);
        } else {
          // Send the Radar Session to your server or store it and
          // send later when the user submits their payment details.
          radar_session = result.radarSession.id;
          stripe.confirmCardPayment(pi_secret, {
            payment_method: pm_id,
            radar_options: {
                session: radar_session
            }
        }).then(function(result) {
            var result_message = document.getElementById("result_message");
            if (result.error) {
                result_message.outerText = result.error
            } else {
                result_message.outerText = "You confirmed " + pi_secret + " with " + pm_id; 
            }
            
        });
        }
      });
     


  }