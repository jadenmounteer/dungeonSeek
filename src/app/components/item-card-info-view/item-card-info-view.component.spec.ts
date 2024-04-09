import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCardInfoViewComponent } from './item-card-info-view.component';

describe('ItemCardInfoViewComponent', () => {
  let component: ItemCardInfoViewComponent;
  let fixture: ComponentFixture<ItemCardInfoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemCardInfoViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemCardInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
