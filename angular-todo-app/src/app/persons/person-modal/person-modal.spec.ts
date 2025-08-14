import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonModal } from './person-modal';

describe('PersonModal', () => {
  let component: PersonModal;
  let fixture: ComponentFixture<PersonModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
