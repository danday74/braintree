import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { IPingPong } from '../interfaces/i-ping-pong'
import { Observable } from 'rxjs'
import { IClientToken } from '../interfaces/i-client-token'

@Injectable({ providedIn: 'root' })
export class InitService {
  private readonly http: HttpClient = inject(HttpClient)

  async init(): Promise<boolean> {
    const promises: Promise<boolean>[] = [this.pingPong(), this.clientToken()]
    const results: boolean[] = await Promise.all(promises)
    return results.every((result: boolean) => result)
  }

  private async pingPong(): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      return this.getPingPong().subscribe({
        next: (response: IPingPong) => resolve(response.ping === 'pong'),
        error: (err: HttpErrorResponse) => reject(err),
      })
    })
  }

  private async clientToken(): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      return this.getClientToken().subscribe({
        next: (response: IClientToken) => {
          if (response.clientToken) {
            localStorage.setItem('clientToken', response.clientToken)
            resolve(true)
          } else {
            localStorage.removeItem('clientToken')
            resolve(false)
          }
        },
        error: (err: HttpErrorResponse) => reject(err),
      })
    })
  }

  private getPingPong(): Observable<IPingPong> {
    return this.http.get<IPingPong>('/api/ping')
  }

  private getClientToken(): Observable<IClientToken> {
    return this.http.get<IClientToken>('/api/client-token')
  }
}
