# Stripe billing demo (SCA ready)

#### See this demo live
- https://stripe-billing-sca.herokuapp.com
#### Details about the code stack
  - Sinatra + Ruby backend
  - ERB frontend
  - Bootstrap CSS (https://getbootstrap.com/)
#### Prerequisites to run locally
  - Sinatra: gem install sinatra
  - Stripe: gem install stripe
  - JSON: gem install json

#### How to run locally
- Add your test secret key to the following files:
-- run_this_first.rb
-- server.rb
- Add your test public key to public/assets/js/checkout.js
- Open a Terminal window and run the following commands:
```sh
$ cd /~your path~/billing
$ ruby run_this_first.rb #This creates the subscription product and plans on your Stripe account
$ ruby server.rb
```
You can open now http://localhost:4567 in your browser.
