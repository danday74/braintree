const braintree = require('braintree')

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: 'dvk7crxxggftjq3p',
  publicKey: 'kvfqh6grqfk5mbby',
  privateKey: '77cec406f4ec2bfd4b629ced9130462d',
})

module.exports = gateway
