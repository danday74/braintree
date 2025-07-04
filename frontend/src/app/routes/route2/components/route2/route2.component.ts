import { Component, OnInit } from '@angular/core'
import braintree from 'braintree-web'

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
