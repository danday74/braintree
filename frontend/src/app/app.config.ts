import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'
import { InitService } from './services/init.service'
import { provideHttpClient, withFetch } from '@angular/common/http'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideToastr, ToastrService } from 'ngx-toastr'

const initApp = (initService: InitService, toastr: ToastrService) => {
  return (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      initService.init()
        .then((success: boolean) => {
          if (!success) {
            const msg = 'failure initialising app'
            toastr.error(msg)
            console.error(msg)
          }
          resolve(success)
        })
        .catch((err: unknown) => {
          const msg = 'error initialising app, is the backend running?'
          toastr.error(msg)
          console.error(msg, err)
          reject(err)
        })
    })
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideToastr({ progressBar: true }),
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [InitService],
      multi: true,
    },
  ],
}
