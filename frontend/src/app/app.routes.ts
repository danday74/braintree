import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: 'route1',
    loadChildren: () => import('@routes/route1/routes').then(m => m.route1Routes),
  },
  {
    path: 'route2',
    loadChildren: () => import('@routes/route2/routes').then(m => m.route2Routes),
  },
  {
    path: 'route3',
    loadChildren: () => import('@routes/route3/routes').then(m => m.route3Routes),
  },
  {
    path: '**',
    redirectTo: '/route1',
  },
]
