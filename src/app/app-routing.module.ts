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

  // Reservas
  { path: 'reservations', component: ReservationsListComponent },
  { path: 'reservations/new', component: ReservationsFormComponent },
  { path: 'reservations/edit/:id', component: ReservationsFormComponent },

  // Préstamos
  { path: 'loans', component: LoansListComponent },
  { path: 'loans/new', component: LoansFormComponent },
  { path: 'loans/edit/:id', component: LoansFormComponent },*/

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
