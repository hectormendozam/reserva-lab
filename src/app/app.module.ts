import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

import { LandingComponent } from './screens/landing/landing.component';
import { LoginComponent } from './screens/auth/login/login.component';
import { RegisterComponent } from './screens/auth/register/register.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { LabsListComponent } from './screens/labs/list/list.component';
import { LabsFormComponent } from './screens/labs/form/form.component';
import { AdminComponent } from './screens/admin/admin.component';
import { ReportsComponent } from './screens/reports/reports.component';
import { ProfileComponent } from './screens/profile/profile.component';
import { NavbarComponent } from './partials/navbar/navbar.component';
import { SidebarComponent } from './partials/sidebar/sidebar.component';
import { FooterComponent } from './partials/footer/footer.component';
import { BreadcrumbsComponent } from './partials/breadcrumbs/breadcrumbs.component';
import { ToastComponent } from './partials/toast/toast.component';
import { ConfirmReservationComponent } from './modals/confirm-reservation/confirm-reservation.component';
import { ReturnEquipmentComponent } from './modals/return-equipment/return-equipment.component';
import { IncidentReportComponent } from './modals/incident-report/incident-report.component';
import { ReservationsFormComponent } from './screens/reservations/form/form.component';
import { ReservationsListComponent } from './screens/reservations/list/list.component';
import { FormComponent } from './screens/loans/form/form.component';
import { ListComponent } from './screens/loans/list/list.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    LabsListComponent,
    LabsFormComponent,
    AdminComponent,
    ReportsComponent,
    ProfileComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    BreadcrumbsComponent,
    ToastComponent,
    ConfirmReservationComponent,
    ReturnEquipmentComponent,
    IncidentReportComponent,
    ReservationsFormComponent,
    ReservationsListComponent,
    FormComponent,
    ListComponent,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
