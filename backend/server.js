const express = require('express')
const app = express()
const port = 3000
const get2c2pPaymentTokenObj = require('./js/get-2c2p-payment-token-obj')
const do2c2pPayment = require('./js/do-2c2p-payment')
const paymentInquiry = require('./js/payment-inquiry')

app.use(express.json())

app.get('/ping', (req, res) => {
  res.json({ ping: 'pong' })
})

// START: Braintree APIs

const gateway = require('./js/gateway')

const getClientToken = async customerId => {
  const response = await gateway.clientToken.generate({
    customerId, // if provided remembers card details
  })
  return response.clientToken
}

// GET a client token (needed for Braintree integration) valid for 24 hours - providing a customer ID allows previous cards to be remembered
app.get('/client-token/:customerId', async (req, res) => {
  const customerId = req.params.customerId
  if (!customerId) console.warn('no customerId provided when generating client token')
  const clientToken = await getClientToken(customerId)
  res.json({ clientToken })
})

// GET a client token (needed for Braintree integration) valid for 24 hours - previous cards will not be remembered
app.get('/client-token', async (req, res) => {
  console.warn('no customerId provided when generating client token')
  const clientToken = await getClientToken()
  res.json({ clientToken })
})

// find or create a customer from an email address (or other unique customer data) - needed to remember previous cards
app.post('/customer/find-or-create', async (req, res) => {
  const email = req.body.email

  const stream = await gateway.customer.search((search) => search.email().is(email))

  async function collect(streem) {
    const result = []
    for await (const item of streem) {
      result[result.length] = item // avoids using push
    }
    return result
  }

  let customers = await collect(stream)
  customers = customers.slice().sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  if (customers.length) {
    res.json(customers[0])
  } else {
    const result = await gateway.customer.create({ email })
    res.json(result.customer)
  }
})

// take payment - deviceData is optional but helps to prevent fraud
app.post('/transaction/sale', async (req, res) => {
  const amount = req.body.amount
  const nonce = req.body.nonce
  const deviceData = req.body.deviceData

  if (!deviceData) console.warn('no deviceData provided')

  const result = await gateway.transaction.sale({
    amount,
    paymentMethodNonce: nonce,
    deviceData,
    options: { submitForSettlement: true },
  })
  res.json(result)
})

// END: Braintree APIs

app.listen(port, () => {
  console.log(`braintree-be listening on port ${port}`)
})
