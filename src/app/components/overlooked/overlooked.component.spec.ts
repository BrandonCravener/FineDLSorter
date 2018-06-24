import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlookedComponent } from './overlooked.component';

describe('OverlookedComponent', () => {
  let component: OverlookedComponent;
  let fixture: ComponentFixture<OverlookedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverlookedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlookedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
