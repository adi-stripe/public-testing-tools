require 'sinatra'
require 'stripe'
require 'erb'

enable :sessions
Stripe.api_key = 'sk_test_3fWdu6xut3jXSZr89IrvL3Fu00AcTbQmu5'

get '/' do
  @payment_intent = Stripe::PaymentIntent.create({
    amount: 1099,
    currency: 'eur',
    # Verify your integration in this guide by including this parameter
    metadata: {integration_check: 'accept_a_payment'},
  })

  erb :checkout
end
