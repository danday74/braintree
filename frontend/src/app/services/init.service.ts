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
            const prevClientToken: string = localStorage.getItem('clientToken') ?? ''
            const clientToken: string = response.clientToken

            localStorage.setItem('prevClientToken', prevClientToken)
            localStorage.setItem('clientToken', clientToken)

            // const hardcoded = 'eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklqSXdNVGd3TkRJMk1UWXRjMkZ1WkdKdmVDSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllYQnBMbk5oYm1SaWIzZ3VZbkpoYVc1MGNtVmxaMkYwWlhkaGVTNWpiMjBpZlEuZXlKbGVIQWlPakUzTlRFMU9EQTROemdzSW1wMGFTSTZJbU16TURSaE5EY3pMV013WlRFdE5ESXhOUzA0TnpBNUxXRTJOamd3TldReVpqWXdZeUlzSW5OMVlpSTZJamg2ZG0wNGVuYzFlWGsxTkdwemNYWWlMQ0pwYzNNaU9pSm9kSFJ3Y3pvdkwyRndhUzV6WVc1a1ltOTRMbUp5WVdsdWRISmxaV2RoZEdWM1lYa3VZMjl0SWl3aWJXVnlZMmhoYm5RaU9uc2ljSFZpYkdsalgybGtJam9pT0hwMmJUaDZkelY1ZVRVMGFuTnhkaUlzSW5abGNtbG1lVjlqWVhKa1gySjVYMlJsWm1GMWJIUWlPbVpoYkhObGZTd2ljbWxuYUhSeklqcGJJbTFoYm1GblpWOTJZWFZzZENKZExDSnpZMjl3WlNJNld5SkNjbUZwYm5SeVpXVTZWbUYxYkhRaVhTd2liM0IwYVc5dWN5STZlMzE5LnFOdXRBNktFYzVWNFV0TXRPY25CdENKRW9ITzN5N3UzcmYwcmZRcS1Wc0stNU1KWTJITFh6eWF0enNWSEJSUnpjcDB0V2psdlJ0X0YzM3BvWmtodjBnIiwiY29uZmlnVXJsIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzLzh6dm04enc1eXk1NGpzcXYvY2xpZW50X2FwaS92MS9jb25maWd1cmF0aW9uIiwiZ3JhcGhRTCI6eyJ1cmwiOiJodHRwczovL3BheW1lbnRzLnNhbmRib3guYnJhaW50cmVlLWFwaS5jb20vZ3JhcGhxbCIsImRhdGUiOiIyMDE4LTA1LTA4IiwiZmVhdHVyZXMiOlsidG9rZW5pemVfY3JlZGl0X2NhcmRzIl19LCJjbGllbnRBcGlVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvOHp2bTh6dzV5eTU0anNxdi9jbGllbnRfYXBpIiwiZW52aXJvbm1lbnQiOiJzYW5kYm94IiwibWVyY2hhbnRJZCI6Ijh6dm04enc1eXk1NGpzcXYiLCJhc3NldHNVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImF1dGhVcmwiOiJodHRwczovL2F1dGgudmVubW8uc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbSIsInZlbm1vIjoib2ZmIiwiY2hhbGxlbmdlcyI6W10sInRocmVlRFNlY3VyZUVuYWJsZWQiOnRydWUsImFuYWx5dGljcyI6eyJ1cmwiOiJodHRwczovL29yaWdpbi1hbmFseXRpY3Mtc2FuZC5zYW5kYm94LmJyYWludHJlZS1hcGkuY29tLzh6dm04enc1eXk1NGpzcXYifSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImJpbGxpbmdBZ3JlZW1lbnRzRW5hYmxlZCI6dHJ1ZSwiZW52aXJvbm1lbnROb05ldHdvcmsiOnRydWUsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJhbGxvd0h0dHAiOnRydWUsImRpc3BsYXlOYW1lIjoiU2hlbGwiLCJjbGllbnRJZCI6bnVsbCwiYmFzZVVybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXNzZXRzVXJsIjoiaHR0cHM6Ly9jaGVja291dC5wYXlwYWwuY29tIiwiZGlyZWN0QmFzZVVybCI6bnVsbCwiZW52aXJvbm1lbnQiOiJvZmZsaW5lIiwiYnJhaW50cmVlQ2xpZW50SWQiOiJtYXN0ZXJjbGllbnQzIiwibWVyY2hhbnRBY2NvdW50SWQiOiJzaGVsbCIsImN1cnJlbmN5SXNvQ29kZSI6IkVVUiJ9fQ=='
            // localStorage.setItem('prevClientToken', hardcoded)
            // localStorage.setItem('clientToken', hardcoded)

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
