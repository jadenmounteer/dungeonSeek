import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterMenuWeaponMenuComponent } from './character-menu-weapon-menu.component';

describe('CharacterMenuWeaponMenuComponent', () => {
  let component: CharacterMenuWeaponMenuComponent;
  let fixture: ComponentFixture<CharacterMenuWeaponMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterMenuWeaponMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CharacterMenuWeaponMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
