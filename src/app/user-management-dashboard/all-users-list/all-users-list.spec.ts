import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, Subject } from 'rxjs';
import { AllUsersList } from './all-users-list';
import { userMgmtInitial } from '../../shared/ngrx/allUserMgmt/user-mgmt.actions';
import { userMgmtSelector, userMgmtLoading, userMgmtError } from '../../shared/ngrx/allUserMgmt/user-mgmt.selectors';
import { CommonConfirmationDialog } from '../../shared/components/common-confirmation-dialog/common-confirmation-dialog';
import { CreateOrUpdateUser } from '../create-or-update-user/create-or-update-user';
import { Router } from '@angular/router'; // Import Router

describe('AllUsersList', () => {
  let component: AllUsersList;
  let fixture: ComponentFixture<AllUsersList>;
  let store: MockStore;
  let dialog: MatDialog;

  const mockUsers = [
    { id: '1', username: 'testuser1', email: 'test1@example.com', jobRole: 'developer' },
    { id: '2', username: 'testuser2', email: 'test2@example.com', jobRole: 'designer' },
  ];
  const initialState = {
    userMgmt: {
      users: [],
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AllUsersList,
        MatDialogModule,
        BrowserAnimationsModule, 
      ],
      providers: [
        provideMockStore({ initialState }),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: MatDialog,
          useValue: {
            open: () => ({
              afterClosed: () => of(true),
            }),
          },
        },
      ],
    })
      .overrideComponent(AllUsersList, {
        remove: {
          imports: [MatDialogModule],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AllUsersList);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dialog = TestBed.inject(MatDialog);

    store.overrideSelector(userMgmtSelector, mockUsers as any);
    store.overrideSelector(userMgmtLoading, false);
    store.overrideSelector(userMgmtError, null);

    store.refreshState();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch userMgmtInitial action on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(userMgmtInitial());
  });

  it('should populate dataSourceUserList from store selector', () => {
    expect(component.dataSourceUserList.data).toEqual(mockUsers);
  });

  it('should update isLoading from store selector', () => {
    store.overrideSelector(userMgmtLoading, true);
    store.refreshState();
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();
  });

  it('should open CreateOrUpdateUser dialog when openCreateUserDialog is called', () => {
    const dialogSpy = spyOn(dialog, 'open').and.callThrough();
    component.openCreateUserDialog({} as any);
    expect(dialogSpy).toHaveBeenCalledWith(CreateOrUpdateUser, jasmine.any(Object));
  });

  it('should dispatch userMgmtInitial after CreateOrUpdateUser dialog closes with a result', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
    component.openCreateUserDialog({} as any);
    tick();
    expect(dispatchSpy).toHaveBeenCalledWith(userMgmtInitial());
  }));

  it('should not dispatch userMgmtInitial after CreateOrUpdateUser dialog closes without a result', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(false) } as any);
    component.openCreateUserDialog({} as any);
    tick();
    expect(dispatchSpy).not.toHaveBeenCalled();
  }));

  it('should open CommonConfirmationDialog when deleteUserConfirmDialog is called', () => {
    const dialogSpy = spyOn(dialog, 'open').and.callThrough();
    component.deleteUserConfirmDialog({} as any);
    expect(dialogSpy).toHaveBeenCalledWith(CommonConfirmationDialog, jasmine.any(Object));
  });

  it('should dispatch userMgmtInitial after CommonConfirmationDialog closes with a result', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
    component.deleteUserConfirmDialog({} as any);
    tick();
    expect(dispatchSpy).toHaveBeenCalledWith(userMgmtInitial());
  }));

  it('should not dispatch userMgmtInitial after CommonConfirmationDialog closes without a result', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(false) } as any);
    component.deleteUserConfirmDialog({} as any);
    tick();
    expect(dispatchSpy).not.toHaveBeenCalled();
  }));

  it('should navigate to the correct URL when goto is called', () => {
    const router = TestBed.inject(Router);
    const routerSpy = spyOn(router, 'navigate');
    const testUrl = '/new-page';
    component.goto(testUrl);
    expect(routerSpy).toHaveBeenCalledWith([testUrl]);
  });

  it('should unsubscribe from observables on ngOnDestroy', () => {
    const destroySubject = new Subject<void>();
    component['destroy$'] = destroySubject;
    const destroySpy = spyOn(destroySubject, 'next');

    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });
});
