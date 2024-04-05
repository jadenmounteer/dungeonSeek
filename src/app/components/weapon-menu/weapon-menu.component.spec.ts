import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponMenuComponent } from './weapon-menu.component';

describe('WeaponMenuComponent', () => {
  let component: WeaponMenuComponent;
  let fixture: ComponentFixture<WeaponMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeaponMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
