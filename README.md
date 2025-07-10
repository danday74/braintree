# Braintree & 2C2P

## Usage

`cd backend`
`npm i`
`npm start`

`cd frontend`
`npm i`
`npm start`

NOTE: If the backend is not running, the frontend will not work

## Backend

Minimal backend APIs needed for integration are found in [server.js](backend/server.js)

## Braintree

### Docs

docs home https://developer.paypal.com/braintree/docs

getting started https://developer.paypal.com/braintree/docs/start/overview

sandbox signup https://apply.braintreegateway.com/signup/sandbox?utm_campaign=Braintree_Migration&utm_medium=Website&utm_source=Braintree

sandbox dashboard https://sandbox.braintreegateway.com

test card numbers https://developer.paypal.com/braintree/docs/reference/general/testing/node/#valid-card-numbers

### Setting up a Braintree sandbox account

To test integration, you need a Braintree sandbox test account (eventually you will need a real account)

To use your own Braintree sandbox account, create an account using the `sandbox signup` link above

You will be given a `Merchant ID` `Public Key` and `Private Key` - enter those values in [gateway.js](backend/js/braintree/gateway.js)

With a sandbox account, you can view transactions by signing in to the `sandbox dashboard` using the link above

You can configure sandbox settings to set currency, enforce CVV, etc.

### Useful info

* This app affords a minimal Braintree integration

Further APIs may be required ... for example, to remove a card that has previously been remembered

* Braintree offers dropin and hosted fields

The former is easier to integrate, the latter is more flexible and allows custom styling

Both use the same backend APIs

## 2C2P

### Docs

docs home https://developer.2c2p.com/docs/general

test card numbers https://developer.2c2p.com/docs/reference-testing-information

### Flow

1) On client, collect card details and securely send them to server https://developer.2c2p.com/docs/using-secure-pay-javascript-library

2) On server, get payment
   token [payment-token-2c2p.js](backend/js/2c2p/payment-token-2c2p.js) https://developer.2c2p.com/docs/api-payment-token

3) On server, make payment [payment-2c2p.js](backend/js/2c2p/payment-2c2p.js) https://developer.2c2p.com/docs/api-do-payment

4) On server, retrieve payment
   details [payment-inquiry-2c2p.js](backend/js/2c2p/payment-inquiry-2c2p.js) https://developer.2c2p.com/docs/api-payment-inquiry

`2` `3` and `4` occur consecutively in [server.js](backend/server.js)

For a backend integration overview see https://developer.2c2p.com/docs/direct-api-flow-server-to-server

### 2C2P sandbox account

Use a premade demo account https://developer.2c2p.com/docs/sandbox

### Useful info

* Premade demo accounts do not support currency GBP, but GBP is supported in live environment
