import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSessionLobbyComponent } from './game-session-lobby.component';

describe('GameSessionLobbyComponent', () => {
  let component: GameSessionLobbyComponent;
  let fixture: ComponentFixture<GameSessionLobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSessionLobbyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameSessionLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
