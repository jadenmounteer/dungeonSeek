import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnArrowComponent } from './turn-arrow.component';

describe('TurnArrowComponent', () => {
  let component: TurnArrowComponent;
  let fixture: ComponentFixture<TurnArrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnArrowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TurnArrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
