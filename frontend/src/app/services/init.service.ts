import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { IPingPong } from '@interfaces/i-ping-pong'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class InitService {
  private readonly http: HttpClient = inject(HttpClient)

  async init(): Promise<boolean> {
    const promises: Promise<boolean>[] = [this.pingPong()]
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

  private getPingPong(): Observable<IPingPong> {
    return this.http.get<IPingPong>('/api/ping')
  }
}
