import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldMenuComponent } from './gold-menu.component';

describe('GoldMenuComponent', () => {
  let component: GoldMenuComponent;
  let fixture: ComponentFixture<GoldMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoldMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
