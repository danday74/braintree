export interface I2c2pFormData {
  encryptedCardInfo: string // 'really-long-encrypted-string'
  maskedCardInfo: string // '4111 1XXXXXXXXX1111'
  expMonthCardInfo: string // '03'
  expYearCardInfo: string // '2033'
}
