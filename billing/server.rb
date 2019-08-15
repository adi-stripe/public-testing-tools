require 'sinatra'
require 'stripe'
require 'erb'
require 'json'

enable :sessions
#Copy-paste your secret key here
Stripe.api_key = 'sk_test_xxxxxxxx'

get '/success' do
  @subscription = Stripe::Subscription.retrieve(
    id: session[:subscription],
    expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
  )
  erb :success
end

get '/fail' do
  send_file File.join(settings.public_folder, 'fail.html')
end

get '/charge_pm/:payment_method' do
  content_type :json
  @customer = session[:customer]
  @plan = session[:plan]
  @payment_method = Stripe::PaymentMethod.attach(
    params['payment_method'],
    customer: @customer
  )
  @subscription = Stripe::Subscription.create(
    customer: @customer,
    default_payment_method: params['payment_method'],
    items: [
      {
        plan: @plan
      }
    ],
    expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
    trial_from_plan: true,
  )
  session[:subscription] = @subscription.id;
  @subscription.to_json;
end

get '/' do
  erb :select_plan
end

post '/checkout' do
  @customer = create_customer(params[:customer_name], params[:customer_email])
  @plan = get_plan(session[:plan]);
  session[:customer] = @customer.id
  erb :checkout
end

get '/new_customer/:plan' do
  case params[:plan]
  when 'individual'
    session[:plan] = 'plan_FHZZ0oK7hewheF'
  when 'household'
    session[:plan] = 'plan_FHZbhB65mqiVek'
  when 'corporate'
    session[:plan] = 'plan_FHZdx4WkmVRwqK'
  else
    status 403
    body 'This is a not a valid subscription plan'
  end
  erb :new_customer
end

def create_customer(customer_name, customer_email)
  @customer = Stripe::Customer.create(
    description: "Customer for #{customer_email}",
    name: customer_name,
    email: customer_email
  )
end

def create_payment_intent(amount, customer_id)
  @intent = Stripe::PaymentIntent.create(
    payment_method_types: ['card'],
    amount: amount,
    currency: 'gbp',
    description: "#{amount} GBP payment",
    customer: customer_id
  )
end

def get_plan(id)
  @plan = Stripe::Plan.retrieve(id)
end
