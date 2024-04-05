import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponCardInfoViewComponent } from './weapon-card-info-view.component';

describe('WeaponCardInfoViewComponent', () => {
  let component: WeaponCardInfoViewComponent;
  let fixture: ComponentFixture<WeaponCardInfoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponCardInfoViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeaponCardInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
