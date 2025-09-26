import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarService } from './snack-bar-service';

describe('SnackBarService', () => {
  let service: SnackBarService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [SnackBarService]
    });
    service = TestBed.inject(SnackBarService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#success', () => {
    it('should open snack bar with success message and correct config', () => {
      spyOn(snackBar, 'open');

      const message = 'Success message';
      service.success(message);

      expect(snackBar.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'end',
        panelClass: ['success-toaster'],
      });
    });

    it('should not open snack bar if message is falsy', () => {
      spyOn(snackBar, 'open');

      service.success('');
      service.success(null as any);
      service.success(undefined as any);

      expect(snackBar.open).not.toHaveBeenCalled();
    });
  });

  describe('#error', () => {
    it('should open snack bar with error message and correct config', () => {
      spyOn(snackBar, 'open');

      const message = 'Error message';
      service.error(message);

      expect(snackBar.open).toHaveBeenCalledWith(message, 'Close', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'end',
        panelClass: ['error-toaster'],
      });
    });

    it('should not open snack bar if message is falsy', () => {
      spyOn(snackBar, 'open');

      service.error('');
      service.error(null as any);
      service.error(undefined as any);

      expect(snackBar.open).not.toHaveBeenCalled();
    });
  });
});
