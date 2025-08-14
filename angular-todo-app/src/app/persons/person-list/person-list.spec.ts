import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonList } from './person-list';

describe('PersonList', () => {
  let component: PersonList;
  let fixture: ComponentFixture<PersonList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
