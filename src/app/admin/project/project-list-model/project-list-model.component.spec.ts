import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListModelComponent } from './project-list-model.component';

describe('ProjectListModelComponent', () => {
  let component: ProjectListModelComponent;
  let fixture: ComponentFixture<ProjectListModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectListModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectListModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
