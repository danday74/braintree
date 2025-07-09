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

  readonly email = signal<string>(myAppConfig.email).asReadonly()
  readonly transactionsUrl = signal<string>(myAppConfig.transactionsUrl).asReadonly()

  amount = computed<number>(() => {
    if (this.time() === 10) return 20
    if (this.time() === 20) return 38
    if (this.time() === 30) return 50
    return 0
  })

  model = {
    cardnumber: signal<string>(''),
    month: signal<string>(''),
    year: signal<string>(''),
    cvv: signal<string>(''),
  }

  private formValue = computed<I2c2pPayload>(() => ({
    cardNumber: this.model.cardNumber(),
    expiryMonth: this.model.expiryMonth(),
    expiryYear: this.model.expiryYear(),
    cvv: this.model.cvv(),
  }))

  updateTime(time: number) {
    this.time.set(time)
  }

  pay() {
    console.log('pay', this.formValue())
  }
}
