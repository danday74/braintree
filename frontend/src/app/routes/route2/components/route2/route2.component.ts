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
  private readonly toastr: ToastrService = inject(ToastrService)

  constructor() {
    effect(async () => {
      const clientToken: string = this.clientToken()
      if (clientToken) await this.createClient(clientToken)
    }, { allowSignalWrites: true })
  }

  ngOnInit() {
    this.braintreeService.findOrCreateCustomer({ email: this.email() }).pipe(
      switchMap((customer: ICustomer) => this.braintreeService.getClientToken(customer.id)),
    ).subscribe({
      next: (response: IClientToken) => this.clientToken.set(response.clientToken),
      error: (err: HttpErrorResponse) => console.error('fatal error getting client token', err),
    })
  }

  updateTime(time: number) {
    this.time.set(time)
  }

  async pay() {
    const pl: HostedFieldsTokenizePayload | null = await this.getPayloadFromClient()
    if (pl) {
      const payload: IBraintreeTransactionSalePayload = {
        nonce: pl.nonce,
        deviceData: this.dataCollectorInstance()?.deviceData,
        amount: this.amount(),
      }
      this.braintreeService.transactionSale(payload).subscribe({
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

  private async createClient(clientToken: string) {
    const clientInstance: Client = await braintree.client.create({
      authorization: clientToken,
    })

    const dataCollectorInstance: DataCollector = await braintree.dataCollector.create({
      client: clientInstance,
    })
    this.dataCollectorInstance.set(dataCollectorInstance)

    const hostedFieldsInstance: HostedFields = await braintree.hostedFields.create({
      client: clientInstance,
      styles: {
        'input': {
          'color': 'teal',
          'font-size': '16px',
        },
        'input.valid': {
          'color': 'green',
        },
      },
      fields: {
        number: {
          container: this.cardNumber()!.nativeElement,
          placeholder: '4111 1111 1111 1111',
        },
        cvv: {
          container: this.cvv()!.nativeElement,
          placeholder: '123',
        },
        expirationDate: {
          container: this.expiryDate()!.nativeElement,
          placeholder: '03/33',
        },
      },
    })
    this.hostedFieldsInstance.set(hostedFieldsInstance)
  }

  private async getPayloadFromClient(): Promise<HostedFieldsTokenizePayload | null> {
    try {
      return await this.hostedFieldsInstance()?.tokenize() ?? null
    } catch (err: unknown) {
      this.toastr.error((err as IError).message, 'Payment error')
      return null
    }
  }
}
