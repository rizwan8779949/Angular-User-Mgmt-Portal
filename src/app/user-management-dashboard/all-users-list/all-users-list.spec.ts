import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUsersList } from './all-users-list';

describe('AllUsersList', () => {
  let component: AllUsersList;
  let fixture: ComponentFixture<AllUsersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllUsersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllUsersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
