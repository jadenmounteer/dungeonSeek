import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationMenuComponent } from './confirmation-menu.component';

describe('ConfirmationMenuComponent', () => {
  let component: ConfirmationMenuComponent;
  let fixture: ComponentFixture<ConfirmationMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
