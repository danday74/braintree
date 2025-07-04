# Braintree

## Docs

docs home https://developer.paypal.com/braintree/docs

getting started https://developer.paypal.com/braintree/docs/start/overview

sandbox signup https://apply.braintreegateway.com/signup/sandbox?utm_campaign=Braintree_Migration&utm_medium=Website&utm_source=Braintree

sandbox dashboard https://sandbox.braintreegateway.com

test card numbers https://developer.paypal.com/braintree/docs/reference/general/testing/node/#valid-card-numbers

## Setting up a Braintree sandbox account

To test integration, you need a Braintree sandbox test account (eventually you will need a real account)

To use your own Braintree sandbox account, create an account using the `sandbox signup` link above

You will be given a `Merchant ID` `Public Key` and `Private Key` - enter those values in [gateway.js](backend/js/gateway.js)

With a sandbox account, you can view transactions by signing in to the `sandbox dashboard` using the link above

You can configure sandbox settings to set currency, enforce CVV, etc.


