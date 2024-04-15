import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterMenuComponent } from './character-menu.component';

describe('CharacterMenuComponent', () => {
  let component: CharacterMenuComponent;
  let fixture: ComponentFixture<CharacterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CharacterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
