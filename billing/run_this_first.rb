require 'stripe'
require 'json'
#Copy-paste your secret key here
Stripe.api_key = 'sk_test_xxxxxxxx'

def create_plan(amount, id, nickname, billing_scheme, tiers, usage_type, aggregate_usage, tiers_mode, trial_period_days)
  #Create a plan
  Stripe::Plan.create({
    amount: amount,
    interval: 'month',
    product: 'prod_FHF7h93NXREt0F',
    currency: 'gbp',
    id: id,
    nickname: nickname,
    interval_count: 1,
    usage_type: usage_type,
    billing_scheme: billing_scheme,
    aggregate_usage: aggregate_usage,
    tiers_mode: tiers_mode,
    trial_period_days: trial_period_days,
    tiers: tiers,
  })
end

def create_products_and_plans()
  #Create a product
  Stripe::Product.create({
    id: "prod_FHF7h93NXREt0F",
    name: 'Coffee Subscription',
    type: 'service',
    statement_descriptor: 'Coffee Shop',
    unit_label: "coffee",
  })

  create_plan(1000, 'plan_FHZZ0oK7hewheF', 'Individual Coffee Subscription', 'per_unit', nil, 'licensed', nil, nil, nil)
  create_plan(2000, 'plan_FHZbhB65mqiVek', 'Household Coffee Subscription', 'per_unit', nil, 'licensed', nil, nil, 30)
  tiers = [
    {
      flat_amount: nil,
      unit_amount: 1000,
      up_to: 2
    },
    {
      flat_amount: nil,
      unit_amount: 800,
      up_to: 10
    },
    {
      flat_amount: nil,
      unit_amount: 600,
      up_to: 'inf'
    }
  ]
  create_plan(nil, 'plan_FHZdx4WkmVRwqK', 'Corporate Coffee Subscription', 'tiered', tiers, 'metered', 'sum', 'graduated', nil)
end

def main() 
  begin
    #try get prod_FHF7h93NXREt0F if not found, create it
    @sub = Stripe::Product.retrieve('prod_FHF7h93NXREt0F')
    print "Your subscriptions are created. You are good to start testing."
  rescue
    create_products_and_plans()
    print "You are ready to go. Make sure you update your sk and pk in server.rb and public/assets/js/checkout.js. After this, just run 'ruby server.rb'."
  end
end
main