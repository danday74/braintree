const express = require('express')
const app = express()
const port = 3000

const gateway = require('./js/gateway')

app.get('/ping', (req, res) => {
  res.json({ ping: 'pong' })
})

app.get('/client-token', (req, res) => {
  gateway.clientToken.generate({}).then(response => {
    res.json({ clientToken: response.clientToken })
  })
})

app.listen(port, () => {
  console.log(`braintree-be listening on port ${port}`)
})
