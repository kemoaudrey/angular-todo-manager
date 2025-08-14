import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoModal } from './todo-modal';

describe('TodoModal', () => {
  let component: TodoModal;
  let fixture: ComponentFixture<TodoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
