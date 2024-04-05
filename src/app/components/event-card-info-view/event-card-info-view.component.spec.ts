import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardInfoViewComponent } from './event-card-info-view.component';

describe('EventCardInfoViewComponent', () => {
  let component: EventCardInfoViewComponent;
  let fixture: ComponentFixture<EventCardInfoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCardInfoViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
