import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { IClientToken } from '@interfaces/i-client-token'
import { IBraintreeTransactionSaleResponse } from '@interfaces/i-braintree-transaction-sale-response'
import { ICustomer } from '@interfaces/i-customer'
import { ICustomerDetails } from '@interfaces/i-customer-details'
import { IBraintreeTransactionSalePayload } from '@interfaces/i-braintree-transaction-sale-payload'

@Injectable({ providedIn: 'root' })
export class BraintreeService {
  private readonly http: HttpClient = inject(HttpClient)

  transactionSale(payload: IBraintreeTransactionSalePayload): Observable<IBraintreeTransactionSaleResponse> {
    const url = '/api/braintree/transaction/sale'
    return this.http.post<IBraintreeTransactionSaleResponse>(url, payload)
  }

  findOrCreateCustomer(customerDetails: ICustomerDetails): Observable<ICustomer> {
    const url = '/api/braintree/customer/find-or-create'
    return this.http.post<ICustomer>(url, customerDetails)
  }

  getClientToken(customerId: string | null = null): Observable<IClientToken> {
    const baseUrl = '/api/braintree/client-token'
    const url = customerId ? `${baseUrl}/${customerId}` : baseUrl
    return this.http.get<IClientToken>(url)
  }
}
