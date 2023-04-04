import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetDurationComponent } from './bet-duration.component';

describe('BetDurationComponent', () => {
  let component: BetDurationComponent;
  let fixture: ComponentFixture<BetDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetDurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
