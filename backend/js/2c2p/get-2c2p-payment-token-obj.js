const jwt = require('jsonwebtoken')
const config = require('../../config')
const axios = require('axios')

// see https://developer.2c2p.com/docs/api-payment-token
const get2c2pPaymentTokenObj = async (amount, currency, invoiceNo) => {

  const tokenObj = {
    merchantID: config.twoCTwoP.merchantID,
    invoiceNo,
    description: 'item description',
    amount,
    currencyCode: currency,
    request3DS: 'N',
  }
  const token = jwt.sign(tokenObj, config.twoCTwoP.jwt.secret)

  const url = 'https://sandbox-pgw.2c2p.com/payment/4.3/paymentToken'
  const payload = { payload: token }
  const headers = { 'Content-Type': 'application/json' }
  const response = await axios.post(url, payload, { headers })
  const responseData = response.data

  const remoteToken = responseData.payload
  if (remoteToken) {
    const decoded = jwt.verify(remoteToken, config.twoCTwoP.jwt.secret)
    return {
      success: decoded.respCode === '0000',
      responseData,
      decoded,
      ...decoded,
      webPaymentUrl: decoded.webPaymentUrl,
      paymentToken: decoded.paymentToken,
      respCode: decoded.respCode,
      respDesc: decoded.respDesc,
    }
  } else {
    return {
      success: false,
      responseData,
      decoded: null,
      webPaymentUrl: null,
      paymentToken: null,
      respCode: responseData.respCode,
      respDesc: responseData.respDesc,
    }
  }
}

module.exports = get2c2pPaymentTokenObj
