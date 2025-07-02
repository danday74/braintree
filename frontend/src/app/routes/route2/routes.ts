import { Routes } from '@angular/router'
import { Route2Component } from '@routes/route2/components/route2/route2.component'

export const route2Routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: Route2Component,
      },
    ],
  },
]
