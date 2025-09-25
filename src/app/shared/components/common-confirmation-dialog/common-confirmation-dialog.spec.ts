import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonConfirmationDialog } from './common-confirmation-dialog';

describe('CommonConfirmationDialog', () => {
  let component: CommonConfirmationDialog;
  let fixture: ComponentFixture<CommonConfirmationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonConfirmationDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonConfirmationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
