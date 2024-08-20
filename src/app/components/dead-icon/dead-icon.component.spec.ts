import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadIconComponent } from './dead-icon.component';

describe('DeadIconComponent', () => {
  let component: DeadIconComponent;
  let fixture: ComponentFixture<DeadIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeadIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeadIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
