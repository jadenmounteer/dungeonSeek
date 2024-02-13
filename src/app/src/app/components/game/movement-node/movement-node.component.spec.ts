import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementNodeComponent } from './movement-node.component';

describe('MovementNodeComponent', () => {
  let component: MovementNodeComponent;
  let fixture: ComponentFixture<MovementNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementNodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovementNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
