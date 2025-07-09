import { WritableSignal } from '@angular/core'

export interface I2c2pModel {
  cardnumber: WritableSignal<string>
  month: WritableSignal<string>
  year: WritableSignal<string>
  cvv: WritableSignal<string>
}
