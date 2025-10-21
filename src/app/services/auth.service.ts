import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@@Injectable({providedIn:'root'})
export class AuthService {
  private api = environment.apiBaseUrl;
  tokenKey = 'access_token';

  constructor(private http: HttpClient) {}

  login(credentials:{correo:string, password:string}) {
    return this.http.post<{access:string,refresh:string}>(`${this.api}/auth/login/`, credentials)
      .pipe(tap(resp => localStorage.setItem(this.tokenKey, resp.access)));
  }

  logout(){ localStorage.removeItem(this.tokenKey); }
  getToken(){ return localStorage.getItem(this.tokenKey); }
}

