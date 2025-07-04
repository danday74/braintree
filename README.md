# Braintree

## Usage

`cd backend`
`npm i`
`npm start`

`cd frontend`
`npm i`
`npm start`

NOTE: If the backend is not running, the frontend will not work

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

## Backend

Minimal Braintree APIs needed for integration are found in [server.js](backend/server.js)

## Useful info

* This app affords a minimal Braintree integration

Further APIs may be required ... for example, to remove a card that has previously been remembered

* Braintree offers dropin and hosted fields

The former is easier to integrate, the latter is more flexible and allows custom styling

Both use the same backend APIs
