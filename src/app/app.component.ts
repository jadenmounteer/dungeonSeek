import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { PromptUpdateService } from './services/prompt-update.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, RouterOutlet, GameComponent],
  providers: [AuthService, PromptUpdateService],
})
export class AppComponent {
  constructor(
    private updateService: PromptUpdateService // This is necessary so the code in its constructor runs.
  ) {}
  title = 'dungeon-seek';
}
