import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonConfirmationDialog } from './common-confirmation-dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('CommonConfirmationDialog', () => {
  let component: CommonConfirmationDialog;
  let fixture: ComponentFixture<CommonConfirmationDialog>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonConfirmationDialog],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonConfirmationDialog);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
