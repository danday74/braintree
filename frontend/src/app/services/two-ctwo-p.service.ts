import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { I2c2pPayload } from '@interfaces/i-2c2p-payload'
import { Observable } from 'rxjs'
import { I2c2pResponse } from '@interfaces/i-2c2p-response'

@Injectable({ providedIn: 'root' })
export class TwoCTwoPService {
  private readonly http: HttpClient = inject(HttpClient)

  processPayment(payload: I2c2pPayload): Observable<I2c2pResponse> {
    const url = '/api/2c2p/process-payment'
    return this.http.post<I2c2pResponse>(url, payload)
  }
}
