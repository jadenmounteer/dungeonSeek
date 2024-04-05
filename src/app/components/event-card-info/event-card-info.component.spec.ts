import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardInfoComponent } from './event-card-info.component';

describe('EventCardInfoComponent', () => {
  let component: EventCardInfoComponent;
  let fixture: ComponentFixture<EventCardInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCardInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
