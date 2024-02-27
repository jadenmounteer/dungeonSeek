import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditGameSessionDialogueComponent } from './create-or-edit-game-session-dialogue.component';

describe('CreateOrEditGameSessionDialogueComponent', () => {
  let component: CreateOrEditGameSessionDialogueComponent;
  let fixture: ComponentFixture<CreateOrEditGameSessionDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrEditGameSessionDialogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateOrEditGameSessionDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
