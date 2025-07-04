const express = require('express')
const app = express()
const port = 3000

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

app.get('/client-token/:customerId', async (req, res) => {
  const customerId = req.params.customerId
  if (!customerId) console.warn('no customerId provided when generating client token')
  const clientToken = await getClientToken(customerId)
  res.json({ clientToken })
})

app.get('/client-token', async (req, res) => {
  console.warn('no customerId provided when generating client token')
  const clientToken = await getClientToken()
  res.json({ clientToken })
})

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

app.listen(port, () => {
  console.log(`braintree-be listening on port ${port}`)
})
