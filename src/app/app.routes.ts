
import { Routes } from '@angular/router';
import { TaskList } from './components/task-list/task-list';
import { Dashboard } from './components/dashboard/dashboard';
import { TaskForm } from './components/task-form/task-form';
import { Profile } from './components/profile/profile';
import { TeamMembers } from './components/team-members/team-members';

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
  path: 'team-members',
  component: TeamMembers
},
  {
    path: 'tasks',
    component: TaskList
  },
  {
    path: 'tasks/new',
    component: TaskForm
  },
  {
    path: 'tasks/edit/:id',
    component: TaskForm
  },
  {
    path: 'profile',
    component: Profile
  }
];
