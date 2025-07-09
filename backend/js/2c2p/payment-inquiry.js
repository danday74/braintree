const jwt = require('jsonwebtoken')
const axios = require('axios')
const config = require('../../config')

const paymentInquiry = async invoiceNo => {

  const tokenObj = {
    merchantID: config.twoCTwoP.merchantID,
    invoiceNo,
  }
  const token = jwt.sign(tokenObj, config.twoCTwoP.jwt.secret)

  const url = 'https://sandbox-pgw.2c2p.com/payment/4.3/paymentInquiry'
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
      accountNo: decoded.accountNo, // '411111XXXXXX1111'
      customerToken: decoded.customerToken, // ''
      customerTokenExpiry: decoded.customerTokenExpiry, // null
      loyaltyPoints: decoded.loyaltyPoints, // null
      uniqueAccountReference: decoded.uniqueAccountReference, // null
      childMerchantID: decoded.childMerchantID, // null
      processBy: decoded.processBy, // 'VI'
      paymentID: decoded.paymentID, // 'ccpp_12426765'
      schemePaymentID: decoded.schemePaymentID, // ''
      merchantID: decoded.merchantID, // 'JT01'
      invoiceNo: decoded.invoiceNo, // 'inv1752097102487'
      amount: decoded.amount, // 20
      monthlyPayment: decoded.monthlyPayment, // null
      userDefined1: decoded.userDefined1, // ''
      userDefined2: decoded.userDefined2, // ''
      userDefined3: decoded.userDefined3, // ''
      userDefined4: decoded.userDefined4, // ''
      userDefined5: decoded.userDefined5, // ''
      currencyCode: decoded.currencyCode, // 'SGD'
      recurringUniqueID: decoded.recurringUniqueID, // ''
      tranRef: decoded.tranRef, // '12426765'
      referenceNo: decoded.referenceNo, // '9237465'
      approvalCode: decoded.approvalCode, // '116840'
      eci: decoded.eci, // '07'
      transactionDateTime: decoded.transactionDateTime, // '20250710053854'
      agentCode: decoded.agentCode, // 'SCB'
      channelCode: decoded.channelCode, // 'VI'
      issuerCountry: decoded.issuerCountry, // 'US'
      issuerBank: decoded.issuerBank, // 'FIRST DATA CORPORATIONS'
      installmentMerchantAbsorbRate: decoded.installmentMerchantAbsorbRate, // null
      cardType: decoded.cardType, // 'CREDIT'
      idempotencyID: decoded.idempotencyID, // ''
      paymentScheme: decoded.paymentScheme, // 'VI'
      displayProcessingAmount: decoded.displayProcessingAmount, // false
      respCode: decoded.respCode,
      respDesc: decoded.respDesc,
    }
  } else {
    return {
      success: false,
      responseData,
      decoded: null,
      accountNo: null,
      customerToken: null,
      customerTokenExpiry: null,
      loyaltyPoints: null,
      uniqueAccountReference: null,
      childMerchantID: null,
      processBy: null,
      paymentID: null,
      schemePaymentID: null,
      merchantID: null,
      invoiceNo: null,
      amount: null,
      monthlyPayment: null,
      userDefined1: null,
      userDefined2: null,
      userDefined3: null,
      userDefined4: null,
      userDefined5: null,
      currencyCode: null,
      recurringUniqueID: null,
      tranRef: null,
      referenceNo: null,
      approvalCode: null,
      eci: null,
      transactionDateTime: null,
      agentCode: null,
      channelCode: null,
      issuerCountry: null,
      issuerBank: null,
      installmentMerchantAbsorbRate: null,
      cardType: null,
      idempotencyID: null,
      paymentScheme: null,
      displayProcessingAmount: null,
      respCode: responseData.respCode,
      respDesc: responseData.respDesc,
    }
  }
}

module.exports = paymentInquiry
