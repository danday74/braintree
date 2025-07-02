import { Routes } from '@angular/router'
import { Route1Component } from '@routes/route1/components/route1/route1.component'

export const route1Routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: Route1Component,
      },
    ],
  },
]
