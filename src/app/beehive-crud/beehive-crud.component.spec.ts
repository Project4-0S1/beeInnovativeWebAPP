import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeehiveCrudComponent } from './beehive-crud.component';

describe('BeehiveCrudComponent', () => {
  let component: BeehiveCrudComponent;
  let fixture: ComponentFixture<BeehiveCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeehiveCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeehiveCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
