import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterProfileImageComponent } from './character-profile-image.component';

describe('CharacterProfileImageComponent', () => {
  let component: CharacterProfileImageComponent;
  let fixture: ComponentFixture<CharacterProfileImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterProfileImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CharacterProfileImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
