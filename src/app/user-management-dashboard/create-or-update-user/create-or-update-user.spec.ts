import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrUpdateUser } from './create-or-update-user';

describe('CreateOrUpdateUser', () => {
  let component: CreateOrUpdateUser;
  let fixture: ComponentFixture<CreateOrUpdateUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrUpdateUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrUpdateUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
