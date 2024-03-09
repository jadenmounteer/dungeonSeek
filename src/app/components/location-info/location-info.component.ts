import { Component, Input } from '@angular/core';
import { LocationNode } from '../../services/location-service';

@Component({
  selector: 'app-location-info',
  standalone: true,
  imports: [],
  templateUrl: './location-info.component.html',
  styleUrl: './location-info.component.scss',
})
export class LocationInfoComponent {
  @Input() location: LocationNode | undefined;

  constructor() {}
}
