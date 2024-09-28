import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularTestComponent } from './angular-test.component';

describe('AngularTestComponent', () => {
  let component: AngularTestComponent;
  let fixture: ComponentFixture<AngularTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
