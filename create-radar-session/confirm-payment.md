<html>
    <head>
        <script src="https://js.stripe.com/v3/"></script>
        <script src="confirm-payment.js"></script>
    </head>
    <body>
        <label for="pi_secret">Client Secret</label> 
        <input type="text" id="pi_secret" />
        <br />
        <label for="pm_id">Payment Method</label> 
        <input type="text" id="pm_id" />
        <br />
        <button id="confirm" onclick="confirmPayment()">Confirm Payment</button>
        <p id="result_message"></p>
    </body>
</html>
