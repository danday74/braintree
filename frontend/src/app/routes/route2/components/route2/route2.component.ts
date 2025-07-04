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
  ngOnInit() {
    console.log('braintree', braintree)
  }
}
