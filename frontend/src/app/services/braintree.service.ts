import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { IClientToken } from '../interfaces/i-client-token'
import { PaymentMethodPayload } from 'braintree-web-drop-in'
import { IBraintreeTransactionSaleResponse } from '../interfaces/i-braintree-transaction-sale-response'

@Injectable({ providedIn: 'root' })
export class BraintreeService {
  private readonly http: HttpClient = inject(HttpClient)

  transactionSale(paymentMethodPayload: PaymentMethodPayload, amount: number): Observable<IBraintreeTransactionSaleResponse> {
    const url = '/api/transaction/sale'
    const payload = {
      nonce: paymentMethodPayload.nonce,
      deviceData: paymentMethodPayload.deviceData,
      amount,
    }
    return this.http.post<IBraintreeTransactionSaleResponse>(url, payload)
  }

  getClientToken(): Observable<IClientToken> {
    const url = '/api/client-token'
    return this.http.get<IClientToken>(url)
  }
}
