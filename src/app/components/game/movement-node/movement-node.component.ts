import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-movement-node',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movement-node.component.html',
  styleUrl: './movement-node.component.scss',
})
export class MovementNodeComponent implements OnChanges {
  @Input() public distanceFromCharacter: number | null = null;
  @Input() public characterMovementSpeed: number | undefined;
  protected withinReach: boolean = false;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.setWithinReach();
  }

  private setWithinReach(): void {
    if (!this.characterMovementSpeed) {
      return;
    }
    if (this.distanceFromCharacter === null) {
      this.withinReach = false;
    } else {
      this.withinReach =
        this.distanceFromCharacter! <= this.characterMovementSpeed;
    }
  }
}
