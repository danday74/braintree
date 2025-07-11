import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { myAppConfig } from '../../../../my-app.config'
import { TwoCTwoPService } from '@services/two-ctwo-p.service'
import { I2c2pPayload } from '@interfaces/i-2c2p-payload'
import { I2c2pFormData } from '@interfaces/i-2c2p-form-data'
import { HttpErrorResponse } from '@angular/common/http'
import { ToastrService } from 'ngx-toastr'
import { I2c2pModel } from '@interfaces/i-2c2p-model'
import { I2c2pResponse } from '@interfaces/i-2c2p-response'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const My2c2p: any

@Component({
  selector: 'app-route3',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './route3.component.html',
  styleUrl: './route3.component.scss',
})
export class Route3Component {
  time = signal<number>(10)

  private cardnumber = viewChild<ElementRef<HTMLInputElement>>('cardnumber')
  private month = viewChild<ElementRef<HTMLInputElement>>('month')
  private year = viewChild<ElementRef<HTMLInputElement>>('year')
  private cvv = viewChild<ElementRef<HTMLInputElement>>('cvv')
  private payForm = viewChild('payForm', { read: ElementRef })

  readonly email = signal<string>(myAppConfig.email).asReadonly()
  private readonly currency = signal<string>(myAppConfig.defaultCurrency).asReadonly()

  amount = computed<number>(() => {
    if (this.time() === 10) return 20
    if (this.time() === 20) return 38
    if (this.time() === 30) return 50
    return 0
  })

  model: I2c2pModel = {
    cardnumber: signal<string>(''),
    month: signal<string>(''),
    year: signal<string>(''),
    cvv: signal<string>(''),
  }

  errors: I2c2pModel = {
    cardnumber: signal<string>(''),
    month: signal<string>(''),
    year: signal<string>(''),
    cvv: signal<string>(''),
  }

  private readonly twoCTwoPService: TwoCTwoPService = inject(TwoCTwoPService)
  private readonly toastr: ToastrService = inject(ToastrService)

  updateTime(time: number) {
    this.time.set(time)
  }

  // below based on https://developer.2c2p.com/docs/using-secure-pay-javascript-library

  pay() {
    this.clearFormErrorMessage()
    this.formatCardnumber()

    const production = false
    const env = production ? My2c2p.APIEnvironment.Production : My2c2p.APIEnvironment.Sandbox

    My2c2p.getEncrypted(env, this.payForm()!.nativeElement, (formData: I2c2pFormData, errCode: number, errDesc: string) => {
      if (errCode === 0) {
        this.processPayment(formData)
      } else {
        this.displayFormErrorMessage(errCode, errDesc)
      }
    })
  }

  private processPayment(formData: I2c2pFormData) {
    const payload: I2c2pPayload = {
      encryptedCardInfo: formData.encryptedCardInfo,
      amount: this.amount(),
      currency: this.currency(),
    }

    this.twoCTwoPService.processPayment(payload).subscribe({
      next: (response: I2c2pResponse) => {
        if (response.success) {
          this.toastr.success('Payment success')
          console.log('Route3Component.processPayment success', response)
        } else {
          this.toastr.error(response.message, 'Payment failure')
          console.error('Route3Component.processPayment failure', response)
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(err.message, 'Payment error')
        console.error('Route3Component.processPayment error', err)
      },
    })
  }

  private clearFormErrorMessage() {
    this.errors.cardnumber.set('')
    this.errors.month.set('')
    this.errors.year.set('')
    this.errors.cvv.set('')
  }

  private displayFormErrorMessage(errCode: number, errDesc: string) {
    switch (errCode) {
      case 1:
      case 2:
        this.errors.cardnumber.set(errDesc)
        this.cardnumber()?.nativeElement.focus()
        break
      case 3:
      case 4:
      case 8:
      case 9:
      case 11:
        this.errors.month.set(errDesc)
        this.month()?.nativeElement.focus()
        break
      case 5:
      case 6:
      case 7:
      case 12:
        this.errors.year.set(errDesc)
        this.year()?.nativeElement.focus()
        break
      case 10:
        this.errors.cvv.set(errDesc)
        this.cvv()?.nativeElement.focus()
        break
      default:
        console.warn('unable to display form error message', { errCode, errDesc })
    }
  }

  private formatCardnumber() {
    let formattedCardnumber: string = this.model.cardnumber()
    formattedCardnumber = formattedCardnumber.replaceAll(' ', '')
    this.model.cardnumber.set(formattedCardnumber)
    this.cardnumber()!.nativeElement.value = formattedCardnumber
  }
}
