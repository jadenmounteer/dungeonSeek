import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { fadeIn } from '../../animations/fade-in-animation';
import { fadeOut } from '../../animations/fade-out-animation';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  animations: [fadeIn, fadeOut],
})
export class MenuComponent implements OnDestroy {
  @Output() closeMenu = new EventEmitter<any>();
  @Input() showCloseMenu: boolean = false;
  @Input() fullScreen: boolean = true;
  @Input() subMenu: boolean = false; // If this menu was opened in another menu

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.disableBodyScroll();
  }

  public ngOnDestroy() {
    if (!this.subMenu) {
      this.enableBodyScroll();
    }
  }

  protected onCloseMenu() {
    this.closeMenu.emit();
  }

  protected enableBodyScroll() {
    this.document.body.style.overflow = 'auto';
  }
  protected disableBodyScroll() {
    this.document.body.style.overflow = 'hidden';
  }
}
