import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { GameComponent } from './components/game/game.component';
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
    private auth: Auth
  ) {
    this.auth.onAuthStateChanged((user) => {
      this.authService.activeUser = user;
      this.authService.isLoggedIn = !!user;
      this.appInitializing = false;
      if (this.authService.isLoggedIn) {
        this.router.navigateByUrl('home');
      }
    });
  }
  title = 'dungeon-seek';
}
