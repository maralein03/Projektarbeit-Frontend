import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { RoleGuard } from './guards/role-guard';
import { Dashboard } from './components/dashboard/dashboard';
import { TodoList } from './components/todo-list/todo-list';
import { TodoDetail } from './components/todo-detail/todo-detail';
import { TodoForm } from './components/todo-form/todo-form';
import { QuestionList } from './components/question-list/question-list';
import { Login } from './components/login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: 'todos',
    component: TodoList,
    canActivate: [authGuard]
  },
  {
    path: 'todos/create',
    component: TodoForm,
    canActivate: [authGuard, RoleGuard],
    data: { role: 'ROLE_UPDATE' }
  },
  {
    path: 'todos/:id',
    component: TodoDetail,
    canActivate: [authGuard]
  },
  {
    path: 'questions/:todoId',
    component: QuestionList,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
