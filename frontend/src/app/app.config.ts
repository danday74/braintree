import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'
import { InitService } from './services/init.service'
import { provideHttpClient, withFetch } from '@angular/common/http'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideToastr } from 'ngx-toastr'

const initApp = (initService: InitService) => {
  return () => {
    initService.init()
      .then((success: boolean) => {
        if (success) {
          console.log('initApp success', success)
        } else {
          console.error('initApp failure', success)
        }
      })
      .catch((err: unknown) => console.error('initApp error', err))
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
