import { Component, computed, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core'
import braintreeWebDropin, { Dropin, PaymentMethodPayload } from 'braintree-web-drop-in'
import { BraintreeService } from '@services/braintree.service'
import { HttpErrorResponse } from '@angular/common/http'
import { ToastrService } from 'ngx-toastr'
import { IError } from '@interfaces/i-error'
import { IBraintreeTransactionSaleResponse } from '@interfaces/i-braintree-transaction-sale-response'
import { ICustomer } from '@interfaces/i-customer'
import { switchMap } from 'rxjs'
import { IClientToken } from '@interfaces/i-client-token'
import { myAppConfig } from '../../../../my-app.config'
import { IBraintreeTransactionSalePayload } from '@interfaces/i-braintree-transaction-sale-payload'

@Component({
  selector: 'app-route1',
  standalone: true,
  imports: [],
  templateUrl: './route1.component.html',
  styleUrl: './route1.component.scss',
})
export class Route1Component implements OnInit {
  time = signal<number>(10)

  private dropin = viewChild<ElementRef<HTMLDivElement>>('dropin')
  readonly email = signal<string>(myAppConfig.email).asReadonly()

  private clientToken = signal<string>('')
  private dropinInstance = signal<Dropin | null>(null)

  amount = computed<number>(() => {
    if (this.time() === 10) return 20
    if (this.time() === 20) return 38
    if (this.time() === 30) return 50
    return 0
  })

  private readonly braintreeService: BraintreeService = inject(BraintreeService)
  private readonly toastr: ToastrService = inject(ToastrService)

  constructor() {
    effect(async () => {
      const clientToken: string = this.clientToken()
      if (clientToken) await this.createDropin(clientToken)
    }, { allowSignalWrites: true })
  }

  ngOnInit() {
    this.braintreeService.findOrCreateCustomer({ email: this.email() }).pipe(
      switchMap((customer: ICustomer) => this.braintreeService.getClientToken(customer.id)),
    ).subscribe({
      next: (response: IClientToken) => this.clientToken.set(response.clientToken),
      error: (err: HttpErrorResponse) => console.error('Route1Component - fatal error getting client token', err),
    })
  }

  updateTime(time: number) {
    this.time.set(time)
  }

  async pay() {
    const payload: PaymentMethodPayload | null = await this.getPayloadFromDropin()
    if (payload) {
      this.braintreeService.transactionSale(payload, this.amount()).subscribe({
        next: (response: IBraintreeTransactionSaleResponse) => {
          if (response.success) {
            this.toastr.success(response.message, 'Payment success')
          } else {
            this.toastr.error(response.message, 'Payment failure')
          }
        },
        error: (err: HttpErrorResponse) => this.toastr.error(err.message, 'Unexpected payment error'),
      })
    }
  }

  private async createDropin(clientToken: string) {
    const container: HTMLDivElement = this.dropin()!.nativeElement

    // see https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html
    const dropinInstance: Dropin = await braintreeWebDropin.create({
      container,
      authorization: clientToken,
      dataCollector: true,
      // very few styling options for dropin
      card: {
        overrides: {
          styles: {
            input: {
              color: 'teal',
            },
          },
        },
      },
    })
    this.dropinInstance.set(dropinInstance)
  }

  private async getPayloadFromDropin(): Promise<PaymentMethodPayload | null> {
    try {
      return await this.dropinInstance()?.requestPaymentMethod() ?? null
    } catch (err: unknown) {
      this.toastr.error((err as IError).message, 'Payment error')
      return null
    }
  }
}
