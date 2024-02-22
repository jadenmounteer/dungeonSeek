import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Observable, defer } from 'rxjs';

// This auth service inspired by: https://garage.sekrab.com/posts/i-setting-up-angularfire-with-auth
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {}

  Login(email: string, password: string): Observable<any> {
    const res = () => signInWithEmailAndPassword(this.auth, email, password);
    // build up a cold observable
    return defer(res);
  }
  // the sign up uses createUserWithEmailAndPassword
  Signup(email: string, password: string, custom: any): Observable<any> {
    const res = () =>
      createUserWithEmailAndPassword(this.auth, email, password);
    // it also accepts an extra attributes, we will handle later
    return defer(res);
  }
  // LoginGoogle(): Observable<any> {
  //   const provider = new GoogleAuthProvider(); // from @angular/fire/auth
  //   const res = () => signInWithPopup(this.auth, provider);
  //   return defer(res);
  // }
}
