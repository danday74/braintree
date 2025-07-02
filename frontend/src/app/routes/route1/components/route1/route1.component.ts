import { AfterViewInit, Component, ElementRef, OnInit, signal, viewChild } from '@angular/core'
import braintree from 'braintree-web'
import braintreeWebDropin from 'braintree-web-drop-in'
import { noop } from 'lodash-es'

@Component({
  selector: 'app-route1',
  standalone: true,
  imports: [],
  templateUrl: './route1.component.html',
  styleUrl: './route1.component.scss',
})
export class Route1Component implements OnInit, AfterViewInit {
  private dropin = viewChild<ElementRef<HTMLDivElement>>('dropin')

  private clientToken = signal<string>('')

  ngOnInit() {
    this.clientToken.set(localStorage.getItem('clientToken') ?? '')
  }

  ngAfterViewInit() {
    console.log('braintree', braintree)
    console.log('braintreeWebDropin', braintreeWebDropin)

    const container: HTMLDivElement = this.dropin()!.nativeElement

    braintreeWebDropin.create({
      container: container,
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
