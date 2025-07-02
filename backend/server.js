const express = require('express')
const app = express()
const port = 3000

const gateway = require('./js/gateway')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/client_token', (req, res) => {
  gateway.clientToken.generate({}).then(response => {
    res.send(response.clientToken)
  })
})

app.listen(port, () => {
  console.log(`braintree-be listening on port ${port}`)
})
