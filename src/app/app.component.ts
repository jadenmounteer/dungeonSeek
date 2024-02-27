import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { GameComponent } from './auth/components/game-component/game.component';
import { PromptUpdateService } from './services/prompt-update.service';
import { AuthService } from './auth/auth.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, RouterOutlet, GameComponent],
  providers: [PromptUpdateService],
})
export class AppComponent {
  protected appInitializing: boolean = true;
  constructor(
    private authService: AuthService,
    private updateService: PromptUpdateService, // This is necessary so the code in its constructor runs.
    private router: Router,
    private auth: Auth,
    private ngZone: NgZone
  ) {
    this.auth.onAuthStateChanged((user) => {
      this.authService.activeUser = user;
      this.authService.isLoggedIn = !!user;
      this.appInitializing = false;
      if (this.authService.isLoggedIn) {
        // Not sure why I need ngZone in this situation, but it's necessary so the home page doesn't appear on top of the game.
        // Something to do with navigating to a new route. Probably because it's called in a callback.
        this.ngZone.run(() => {
          this.router.navigateByUrl('home');
        });
      }
    });
  }
  title = 'dungeon-seek';
}
