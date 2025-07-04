import { Component, computed, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core'
import braintree, { Client, DataCollector, HostedFields, HostedFieldsTokenizePayload } from 'braintree-web'
import { switchMap } from 'rxjs'
import { ICustomer } from '@interfaces/i-customer'
import { IClientToken } from '@interfaces/i-client-token'
import { HttpErrorResponse } from '@angular/common/http'
import { BraintreeService } from '@services/braintree.service'
import { myAppConfig } from '../../../../my-app.config'
import { IError } from '@interfaces/i-error'
import { ToastrService } from 'ngx-toastr'
import { IBraintreeTransactionSalePayload } from '@interfaces/i-braintree-transaction-sale-payload'
import { IBraintreeTransactionSaleResponse } from '@interfaces/i-braintree-transaction-sale-response'

@Component({
  selector: 'app-route2',
  standalone: true,
  imports: [],
  templateUrl: './route2.component.html',
  styleUrl: './route2.component.scss',
})
export class Route2Component implements OnInit {
  time = signal<number>(10)

  private cardNumber = viewChild<ElementRef<HTMLDivElement>>('cardNumber')
  private cvv = viewChild<ElementRef<HTMLDivElement>>('cvv')
  private expiryDate = viewChild<ElementRef<HTMLDivElement>>('expiryDate')

  readonly email = signal<string>(myAppConfig.email).asReadonly()

  private clientToken = signal<string>('')
  private dataCollectorInstance = signal<DataCollector | null>(null)
  private hostedFieldsInstance = signal<HostedFields | null>(null)

  amount = computed<number>(() => {
    if (this.time() === 10) return 20
    if (this.time() === 20) return 38
    if (this.time() === 30) return 50
    return 0
  })

  private readonly braintreeService: BraintreeService = inject(BraintreeService)

  ngOnInit() {
    this.braintreeService.findOrCreateCustomer({ email: this.email() }).pipe(
      switchMap((customer: ICustomer) => this.braintreeService.getClientToken(customer.id)),
    ).subscribe({
      next: (response: IClientToken) => this.clientToken.set(response.clientToken),
      error: (err: HttpErrorResponse) => console.error('Route1Component - fatal error getting client token', err),
    })

    console.log('braintree', braintree)
  }
}
