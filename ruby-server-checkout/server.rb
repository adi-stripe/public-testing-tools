require 'sinatra'
require 'stripe'
require 'erb'
require 'json'

enable :sessions
Stripe.api_key = 'sk_test_xxxx'

get '/' do
  @checkout_session = Stripe::Checkout::Session.create(
    payment_method_types: ['card'],
    line_items: [{
      name: 'T-shirt',
      description: 'Comfortable cotton t-shirt',
      images: ['https://www.schiesser.com/out/pictures/generated/product/1/335_485_90/shirt-kurzarm-jersey-rundhals-weiss-american-t-shirt-154746-100-front.jpg'],
      amount: 500,
      currency: 'eur',
      quantity: 1,
    }],
    success_url: 'http://localhost:4567/success/{CHECKOUT_SESSION_ID}',
  )

  erb :checkout
end

get '/success/:checkout_session_id' do
  checkout_session_id = params['checkout_session_id']
  @checkout_session = Stripe::Checkout::Session.retrieve(
    id: checkout_session_id,
    expand: ['payment_intent']
  )

  erb :success
end
