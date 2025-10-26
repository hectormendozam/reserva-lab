// src/app/screens/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface StatCard { title: string; value: string | number; subtitle?: string; icon?: string; colorClass?: string; }
interface Reservation { id: number; lab: string; user: string; start: string; end: string; status: string; }

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: StatCard[] = [];
  recentReservations: Reservation[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.stats = [
      { title: 'Reservas hoy', value: 8, subtitle: 'Activas', icon: 'bi-calendar-check', colorClass: 'bg-primary' },
      { title: 'Laboratorios', value: 6, subtitle: 'Registrados', icon: 'bi-building', colorClass: 'bg-success' },
      { title: 'Equipos', value: 124, subtitle: 'Totales', icon: 'bi-cpu', colorClass: 'bg-warning' },
      { title: 'Préstamos', value: 3, subtitle: 'Pendientes', icon: 'bi-box-arrow-in-right', colorClass: 'bg-danger' },
    ];

    this.recentReservations = [
      { id: 1, lab: 'Redes A-101', user: 'María Pérez', start: '2025-10-23 09:00', end: '2025-10-23 11:00', status: 'Confirmada' },
      { id: 2, lab: 'Prog B-202', user: 'Juan López', start: '2025-10-23 12:00', end: '2025-10-23 14:00', status: 'Pendiente' },
      { id: 3, lab: 'Electrónica C-303', user: 'Ana Ruiz', start: '2025-10-24 08:00', end: '2025-10-24 10:00', status: 'Cancelada' },
    ];
  }

  goCreateReservation(): void { this.router.navigate(['/reservations/new']); }
  goLabs(): void { this.router.navigate(['/labs']); }
  viewReservation(id: number): void { this.router.navigate(['/reservations/edit', id]); }
}
