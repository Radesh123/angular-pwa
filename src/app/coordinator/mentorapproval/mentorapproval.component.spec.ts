import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorapprovalComponent } from './mentorapproval.component';

describe('MentorapprovalComponent', () => {
  let component: MentorapprovalComponent;
  let fixture: ComponentFixture<MentorapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
