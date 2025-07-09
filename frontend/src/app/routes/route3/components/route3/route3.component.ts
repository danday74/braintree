import { Component, computed, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { myAppConfig } from '../../../../my-app.config'
import { I2c2pPayload } from '@interfaces/i-2c2p-payload'

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
    console.log('pay', this.formValue())
  }
}
