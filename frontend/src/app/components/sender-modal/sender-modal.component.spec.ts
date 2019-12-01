import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SenderModalComponent } from './sender-modal.component';

describe('SenderModalComponent', () => {
  let component: SenderModalComponent;
  let fixture: ComponentFixture<SenderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
