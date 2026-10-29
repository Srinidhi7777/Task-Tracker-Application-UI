
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'https://localhost:7039/api/Tasks';

  constructor(private http: HttpClient) {}

  // Temporary mock data for remaining methods
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Login API',
      description: 'Develop login endpoint',
      priority: 'High',
      status: 'Completed',
      dueDate: '2026-10-05',
      assignedToId: 1,
      assignedToName: 'Sandhiya'
    },
    {
      id: 2,
      title: 'Dashboard UI',
      description: 'Create dashboard UI',
      priority: 'Medium',
      status: 'In Progress',
      dueDate: '2026-10-08',
      assignedToId: 2,
      assignedToName: 'Sri'
    },
    {
      id: 3,
      title: 'Validation',
      description: 'Implement form validation',
      priority: 'Low',
      status: 'Pending',
      dueDate: '2026-10-10',
      assignedToId: 1,
      assignedToName: 'Sandhiya'
    }
  ];

  // GET ALL TASKS - Real API
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // GET TASK BY ID - Mock
getTaskById(id: number): Observable<Task> {
  return this.http.get<Task>(`${this.apiUrl}/${id}`);
}

  // DELETE TASK - Mock
deleteTask(id: number): Observable<boolean> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
    map(() => true)
  );
}

  // CREATE TASK - Mock
createTask(taskData: Omit<Task, 'id'>): Observable<Task> {
  return this.http.post<Task>(this.apiUrl, taskData);
}

  // UPDATE TASK - Mock
updateTask(
  id: number,
  taskData: Partial<Task>
): Observable<boolean> {
  return this.http.put<void>(
    `${this.apiUrl}/${id}`,
    taskData
  ).pipe(
    map(() => true)
  );
}
}
