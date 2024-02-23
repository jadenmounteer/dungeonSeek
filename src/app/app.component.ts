import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { PromptUpdateService } from './services/prompt-update.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, RouterOutlet, GameComponent],
  providers: [PromptUpdateService],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private updateService: PromptUpdateService, // This is necessary so the code in its constructor runs.
    private router: Router
  ) {
    this.authService.userLoggedIn.subscribe((isAuth) => {
      if (isAuth) {
        // navigate to the home page
        this.router.navigate(['/home']);
      }
    });
  }
  title = 'dungeon-seek';
}
