import { Routes } from '@angular/router'
import { Route3Component } from '@routes/route3/components/route3/route3.component'

export const route3Routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: Route3Component,
      },
    ],
  },
]
