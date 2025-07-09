const axios = require('axios')

// see https://developer.2c2p.com/docs/api-do-payment
const payment2c2p = async (paymentToken, encryptedCardInfo) => {

  const url = 'https://sandbox-pgw.2c2p.com/payment/4.3/payment'
  const payload = {
    paymentToken,
    payment: {
      code: {
        channelCode: 'CC', // Credit Card
      },
      data: {
        securePayToken: encryptedCardInfo,
      },
    },
  }
  const headers = { 'Content-Type': 'application/json' }
  const response = await axios.post(url, payload, { headers })
  const responseData = response.data

  return {
    success: responseData.respCode === '2000',
    responseData,
    ...responseData,
    invoiceNo: responseData.invoiceNo ?? null,
    channelCode: responseData.channelCode ?? null,
    respCode: responseData.respCode,
    respDesc: responseData.respDesc,
  }
}

module.exports = payment2c2p
