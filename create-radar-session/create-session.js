var stripe = Stripe('pk_test_AnOcpECn5sgSsIWl0lgN4n7d002LJtdPkg',
                {canCreateRadarSession: true});

stripe.createRadarSession().then(function(result) {
  if (result.error) {
    // Typically you should not abort your checkout flow if an error is returned.
    console.error(result.error);
  } else {
    // Send the Radar Session to your server or store it and
    // send later when the user submits their payment details.
    //radarSessionHandler(result.radarSession);
    document.getElementById("session_id").outerText = result.radarSession;
  }
});