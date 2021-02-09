import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from "./user.model";
import { Router } from "@angular/router";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  
  constructor(private http: HttpClient, private router: Router) {}
  
  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAR1nRPwE9B9qD44iVtivpMaixksz4SVMc',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError), tap(responseData => {
      this.handleAuthentication(responseData.email,
        responseData.localId,
        responseData.idToken,
        +responseData.expiresIn
      )
    }));
  }
  
  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAR1nRPwE9B9qD44iVtivpMaixksz4SVMc',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError), tap(responseData => {
      this.handleAuthentication(responseData.email,
        responseData.localId,
        responseData.idToken,
        +responseData.expiresIn
      )
    }));
  }
  
  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    
    if (this.tokenExpirationTimer)
      clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }
  
  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationData: string
    } = JSON.parse(localStorage.getItem('userData'));
    
    if (!userData)
      return;
    
    const loadedUser = new User(
      userData.email, 
      userData.id, 
      userData._token, 
      new Date(userData._tokenExpirationData)
    );
    
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationData).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
    
  }
  
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(this.logout, expirationDuration);
  }
  
  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
      // multiply with 1000 to convert from seconds to milliseconds
      // convert the expiration milliseconds back to a Date object
      expiresIn *= 1000;
      const expirationDate = new Date(new Date().getTime() + expiresIn);
      const user = new User(email, userId, token, expirationDate);
      this.user.next(user);
      this.autoLogout(expiresIn);
      localStorage.setItem('userData', JSON.stringify(user));
  }
  
  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (!errorResponse.error || !errorResponse.error.error)
      return throwError(errorMessage);
    
    switch(errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already.';
        break;
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid username or password.';
        break;
    }
    
    return throwError(errorMessage);
  }
  
}