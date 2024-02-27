import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditCharacterComponent } from './add-or-edit-character.component';

describe('AddOrEditCharacterComponent', () => {
  let component: AddOrEditCharacterComponent;
  let fixture: ComponentFixture<AddOrEditCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrEditCharacterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddOrEditCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
