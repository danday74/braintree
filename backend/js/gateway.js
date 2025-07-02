const braintree = require('braintree')

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: '8zvm8zw5yy54jsqv',
  publicKey: 'mkgvt4yt3yq4k2tk',
  privateKey: 'e144a4e77f86c55be65c04dff724ba85',
})

module.exports = gateway
