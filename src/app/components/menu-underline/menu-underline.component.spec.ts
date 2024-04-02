import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUnderlineComponent } from './menu-underline.component';

describe('MenuUnderlineComponent', () => {
  let component: MenuUnderlineComponent;
  let fixture: ComponentFixture<MenuUnderlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuUnderlineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuUnderlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
