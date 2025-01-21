import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeehiveFormComponent } from './beehive-form.component';

describe('BeehiveFormComponent', () => {
  let component: BeehiveFormComponent;
  let fixture: ComponentFixture<BeehiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeehiveFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeehiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
