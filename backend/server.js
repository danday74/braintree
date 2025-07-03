const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

const gateway = require('./js/gateway')

app.get('/ping', (req, res) => {
  res.json({ ping: 'pong' })
})

app.get('/client-token', (req, res) => {
  gateway.clientToken.generate({}).then(response => {
    res.json({ clientToken: response.clientToken })
  })
})

app.post('/transaction/sale', (req, res) => {
  const amount = req.body.amount
  const nonce = req.body.nonce
  const deviceData = req.body.deviceData

  gateway.transaction.sale({
    amount,
    paymentMethodNonce: nonce,
    deviceData,
    options: { submitForSettlement: true },
  }).then(result => {
    res.json(result)
  })
})

app.listen(port, () => {
  console.log(`braintree-be listening on port ${port}`)
})
