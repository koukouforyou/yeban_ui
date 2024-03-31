import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHumanrelationModalComponent } from './update-humanrelation-modal.component';

describe('UpdateHumanrelationModalComponent', () => {
  let component: UpdateHumanrelationModalComponent;
  let fixture: ComponentFixture<UpdateHumanrelationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateHumanrelationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateHumanrelationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
