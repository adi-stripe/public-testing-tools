import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentMethod;

public class PaymentIntentsOffSession {
	
	public static void main(String[] args) {
		Stripe.apiKey = "sk_test_xxxxxxxxxxxxx"; //Your secret key
		Customer customer = createCustomer();
		PaymentMethod paymentMethod = createPaymentMethod();
		attach(paymentMethod, customer);
		PaymentIntent paymentIntent = createPaymentIntent(paymentMethod, customer);
		System.out.println(paymentIntent);
	}
	
	/*
	 * [1] Create a customer 
	 */
	public static Customer createCustomer() {
		Map<String, Object> customerParams = new HashMap<String, Object>();
		customerParams.put("description", "Customer for jenny.rosen@example.com");
		customerParams.put("source", "tok_amex");
		// ^ obtained with Stripe.js
		try {
			Customer customer = Customer.create(customerParams);
			return customer;
		} catch (StripeException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	/*
	 * [2] Create a Payment Method
	 */
	public static PaymentMethod createPaymentMethod() {
		Map<String, Object> paymentmethodParams = new HashMap<String, Object>();
		paymentmethodParams.put("type", "card");
		Map<String, Object> cardParams = new HashMap<String, Object>();
		cardParams.put("number", "4242424242424242");
		cardParams.put("exp_month", 7);
		cardParams.put("exp_year", 2020);
		cardParams.put("cvc", "314");
		paymentmethodParams.put("card", cardParams);

		try {
			PaymentMethod paymentMethod = PaymentMethod.create(paymentmethodParams);
			return paymentMethod;
		} catch (StripeException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	/*
	 *  [3] Attach Payment method to customer
	 */
	public static void attach(PaymentMethod paymentMethod, Customer customer) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("customer", customer.getId());
		try {
			paymentMethod.attach(params);
		} catch (StripeException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/*
	 * [4] Create off-session Payment Intent 
	 */
	public static PaymentIntent createPaymentIntent(PaymentMethod paymentMethod, Customer customer) {
		Map<String, Object> paymentintentParams = new HashMap<String, Object>();
		paymentintentParams.put("amount", 1099);
		paymentintentParams.put("currency", "usd");
		ArrayList payment_method_types = new ArrayList();
		payment_method_types.add("card");
		paymentintentParams.put("payment_method_types", payment_method_types);
		paymentintentParams.put("customer", customer.getId());
		paymentintentParams.put("payment_method", paymentMethod.getId());
		paymentintentParams.put("off_session", true);
		paymentintentParams.put("confirm", true);

		try {
			PaymentIntent paymentIntent = PaymentIntent.create(paymentintentParams);
			return paymentIntent;
		} catch (StripeException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

}
