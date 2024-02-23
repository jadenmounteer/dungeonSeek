import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateEmail,
} from '@angular/fire/auth';
import { Observable, Subject, defer } from 'rxjs';

// This auth service inspired by: https://garage.sekrab.com/posts/i-setting-up-angularfire-with-auth
@Injectable({ providedIn: 'root' })
export class AuthService {
  public isAuth: boolean = false;
  public activeUser: User | null = null;
  public userLoggedIn: Subject<boolean> = new Subject<boolean>();

  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged((user) => {
      this.activeUser = user;
      this.isAuth = !!user;
      this.userLoggedIn.next(this.isAuth);
    });
  }

  public login(email: string, password: string): Observable<any> {
    const res = () => signInWithEmailAndPassword(this.auth, email, password);
    // build up a cold observable
    return defer(res);
  }

  public forgotPassword(email: string): Observable<any> {
    const res = () => sendPasswordResetEmail(this.auth, email);
    return defer(res);
  }

  public updateEmail(newEmail: string): Observable<any> {
    if (!this.activeUser) {
      throw new Error('No active user');
    }
    const res = () => updateEmail(this.activeUser!, newEmail);
    return defer(res);
  }

  public logout(): Observable<any> {
    const res = () => this.auth.signOut();
    return defer(res);
  }

  // the sign up uses createUserWithEmailAndPassword
  public signup(email: string, password: string, custom: any): Observable<any> {
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

  public authReady(): Promise<void> {
    return this.auth.authStateReady();
  }
}
