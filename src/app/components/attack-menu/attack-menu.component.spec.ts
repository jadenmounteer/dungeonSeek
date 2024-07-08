import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackMenuComponent } from './attack-menu.component';

describe('AttackMenuComponent', () => {
  let component: AttackMenuComponent;
  let fixture: ComponentFixture<AttackMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttackMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttackMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
