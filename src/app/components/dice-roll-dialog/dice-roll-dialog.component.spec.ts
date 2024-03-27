import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceRollDialogComponent } from './dice-roll-dialog.component';

describe('DiceRollDialogComponent', () => {
  let component: DiceRollDialogComponent;
  let fixture: ComponentFixture<DiceRollDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiceRollDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiceRollDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
