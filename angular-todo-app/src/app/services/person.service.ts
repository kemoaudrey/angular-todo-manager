import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private baseUrl = 'http://localhost:3000/persons';
  private personsSubject = new BehaviorSubject<Person[]>([]);
  public persons$ = this.personsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPersons();
  }

  loadPersons(): void {
    this.http.get<Person[]>(this.baseUrl).subscribe(persons => {
      this.personsSubject.next(persons);
    });
  }

  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.baseUrl);
  }

  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.baseUrl}/${id}`);
  }

  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(this.baseUrl, person);
  }

  updatePerson(person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.baseUrl}/${person.id}`, person);
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  isNameUnique(name: string, excludeId?: number): Observable<boolean> {
    return new Observable(observer => {
      this.getPersons().subscribe(persons => {
        const trimmedName = name.trim().toLowerCase();
        const isUnique = !persons.some(person =>
          person.name.toLowerCase() === trimmedName && person.id !== excludeId
        );
        observer.next(isUnique);
        observer.complete();
      });
    });
  }
}
