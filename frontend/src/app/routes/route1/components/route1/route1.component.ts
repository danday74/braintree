import { AfterViewInit, Component, computed, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core'
import braintree from 'braintree-web'
import braintreeWebDropin, { Dropin, PaymentMethodPayload } from 'braintree-web-drop-in'
import { BraintreeService } from '../../../../services/braintree.service'
import { HttpErrorResponse } from '@angular/common/http'
import { ToastrService } from 'ngx-toastr'
import { IError } from '../../../../interfaces/i-error'
import { IBraintreeTransactionSaleResponse } from '../../../../interfaces/i-braintree-transaction-sale-response'

@Component({
  selector: 'app-route1',
  standalone: true,
  imports: [],
  templateUrl: './route1.component.html',
  styleUrl: './route1.component.scss',
})
export class Route1Component implements OnInit, AfterViewInit {
  time = signal<number>(10)

  private dropin = viewChild<ElementRef<HTMLDivElement>>('dropin')

  private clientToken = signal<string>('')
  private dropinInstance = signal<Dropin | null>(null)

  amount = computed<number>(() => this.time() * 2)

  private readonly braintreeService: BraintreeService = inject(BraintreeService)
  private readonly toastr: ToastrService = inject(ToastrService)

  ngOnInit() {
    this.clientToken.set(localStorage.getItem('clientToken') ?? '')
  }

  ngAfterViewInit() {
    console.log('braintree', braintree)
    console.log('braintreeWebDropin', braintreeWebDropin)

    const container: HTMLDivElement = this.dropin()!.nativeElement

    braintreeWebDropin.create({
      container,
      authorization: this.clientToken(),
      // ...plus remaining configuration
    }).then((/* dropinInstance */) => {
      // Use 'dropinInstance' here
      // Methods documented at https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html
    }).catch((/* err */) => {
      noop()
    })
  }
}
