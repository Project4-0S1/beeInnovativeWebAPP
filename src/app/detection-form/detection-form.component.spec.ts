import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectionFormComponent } from './detection-form.component';

describe('DetectionFormComponent', () => {
  let component: DetectionFormComponent;
  let fixture: ComponentFixture<DetectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetectionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
