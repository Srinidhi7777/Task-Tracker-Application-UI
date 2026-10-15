import { Routes } from '@angular/router';
import { TaskList } from './components/task-list/task-list';
import { Dashboard } from './components/dashboard/dashboard';
import { TaskForm } from './components/task-form/task-form';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'tasks',
    component: TaskList
  },
  {
  path: 'tasks/new',
  component: TaskForm
}
];