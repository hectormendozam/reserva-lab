// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importar componentes de las pantallas
import { LandingComponent } from './screens/landing/landing.component';
import { LoginComponent } from './screens/auth/login/login.component';
import { RegisterComponent } from './screens/auth/register/register.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { AdminComponent } from './screens/admin/admin.component';
import { ReportsComponent } from './screens/reports/reports.component';
import { ProfileComponent } from './screens/profile/profile.component';
import { ReservationsFormComponent } from './screens/reservations/form/form.component';
import { ReservationsListComponent } from './screens/reservations/list/list.component';
import { ListComponent } from './screens/loans/list/list.component';
import { FormComponent } from './screens/loans/form/form.component';
const routes: Routes = [
  // Página principal
  { path: '', component: LandingComponent },

  // Autenticación
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Panel principal
  { path: 'dashboard', component: DashboardComponent },

  // Laboratorios
  /*{ path: 'labs', component: LabsListComponent },
  { path: 'labs/new', component: LabsFormComponent },
  { path: 'labs/edit/:id', component: LabsFormComponent },

  // Equipos
  { path: 'equipment', component: EquipmentListComponent },
  { path: 'equipment/new', component: EquipmentFormComponent },
  { path: 'equipment/edit/:id', component: EquipmentFormComponent },
   */

  // Reservas
  { path: 'reservations', component: ReservationsListComponent }, // ← lista
  { path: 'reservations/new', component: ReservationsFormComponent }, // puedes añadir canActivate:[AuthGuard] si ya lo usas

  // Préstamos
  { path: 'loans', component: ListComponent },
  { path: 'loans/new', component: FormComponent },
  // { path: 'loans/edit/:id', component: LoansFormComponent },

  // Administración y reportes
  { path: 'admin', component: AdminComponent },
  { path: 'reports', component: ReportsComponent },

  // Perfil del usuario
  { path: 'profile', component: ProfileComponent },

  // Ruta por defecto (404)
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
