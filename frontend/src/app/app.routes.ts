import { Routes } from '@angular/router';
import { StandFormComponent } from './features/stand/stand-form.component';
import { SuccessComponent } from './features/success/success.component';

export const routes: Routes = [
  { path: '', component: StandFormComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'admin', loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent) },
  { path: '**', redirectTo: '' }
];
