const jwt = require('jsonwebtoken')
const config = require('../config')
const axios = require('axios')

const get2c2pPaymentTokenObj = async (amount, currency) => {
  const tokenObj = {
    merchantID: 'JT01',
    invoiceNo: '152395366A', // 152395366 gives error ... Existing Invoice Number
    description: 'item 1',
    amount,
    currencyCode: currency,
  }
  const token = jwt.sign(tokenObj, config.jwt.secret)

  const url = 'https://sandbox-pgw.2c2p.com/payment/4.3/paymentToken'
  const payload = { payload: token }
  const headers = { 'Content-Type': 'application/json' }
  const response = await axios.post(url, payload, { headers })
  const responseData = response.data

  const remoteToken = responseData.payload
  if (remoteToken) {
    const decoded = jwt.verify(remoteToken, config.jwt.secret)
    return {
      success: decoded.respCode === '0000',
      responseData,
      decoded,
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
