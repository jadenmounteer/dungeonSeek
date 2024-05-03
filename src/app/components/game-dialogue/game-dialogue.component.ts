import {
  Component,
  EventEmitter,
  InputSignal,
  Output,
  input,
} from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-dialogue',
  standalone: true,
  imports: [MenuComponent, CommonModule],
  templateUrl: './game-dialogue.component.html',
  styleUrl: './game-dialogue.component.scss',
})
export class GameDialogueComponent {
  @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();
  @Output() buttonOneClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() buttonTwoClick: EventEmitter<void> = new EventEmitter<void>();
  message: InputSignal<string> = input.required();
  showButtonOne: InputSignal<boolean> = input.required();
  showButtonTwo: InputSignal<boolean> = input.required();

  protected onCloseMenu() {
    this.closeMenu.emit();
  }

  protected onButtonOneClick() {
    this.buttonOneClick.emit();
  }

  protected onButtonTwoClick() {
    this.buttonTwoClick.emit();
  }
}
