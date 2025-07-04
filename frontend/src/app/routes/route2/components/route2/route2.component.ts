import { Component, inject, OnInit, signal } from '@angular/core'
import braintree from 'braintree-web'
import { switchMap } from 'rxjs'
import { ICustomer } from '@interfaces/i-customer'
import { IClientToken } from '@interfaces/i-client-token'
import { HttpErrorResponse } from '@angular/common/http'
import { BraintreeService } from '@services/braintree.service'
import { myAppConfig } from '../../../../my-app.config'

@Component({
  selector: 'app-route2',
  standalone: true,
  imports: [],
  templateUrl: './route2.component.html',
  styleUrl: './route2.component.scss',
})
export class Route2Component implements OnInit {
  readonly email = signal<string>(myAppConfig.email).asReadonly()

  private clientToken = signal<string>('')

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
