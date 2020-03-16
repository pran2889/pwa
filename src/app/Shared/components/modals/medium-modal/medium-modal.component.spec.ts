import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumModalComponent } from './medium-modal.component';

describe('MediumModalComponent', () => {
  let component: MediumModalComponent;
  let fixture: ComponentFixture<MediumModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediumModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediumModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
