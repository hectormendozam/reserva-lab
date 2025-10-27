// src/app/screens/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface StatCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  colorClass?: string;
}

interface Reservation {
  id: number | string;
  lab: string;
  user: string;
  start: string;
  end: string;
  status: 'Confirmada' | 'Pendiente' | 'Cancelada';
}

interface LoanRow {
  id: string;
  equipment: string;
  user: string;
  loanDate: string;
  dueDate: string;
  status: 'Pendiente' | 'Aprobado' | 'Devuelto' | 'Tarde' | 'Dañado';
  isLate?: boolean;
  dueSoon?: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // === Datos existentes ===
  stats: StatCard[] = [];
  recentReservations: Reservation[] = [];

  // === Nuevos (provisionales) ===
  role: 'ADMIN' | 'TECH' | 'STUDENT' = 'ADMIN'; // luego vendrá de auth
  canRegisterReturn = this.role === 'TECH' || this.role === 'ADMIN';

  alerts: { text: string }[] = []; // alertas arriba del dashboard
  loansSummary = { pending: 0, dueSoon: 0, late: 0 }; // KPIs de préstamos
  recentLoans: LoanRow[] = []; // tabla de préstamos

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Tarjetas estadísticas
    this.stats = [
      {
        title: 'Reservas hoy',
        value: 8,
        subtitle: 'Activas',
        icon: 'bi-calendar-check',
        colorClass: 'bg-primary',
      },
      {
        title: 'Laboratorios',
        value: 6,
        subtitle: 'Registrados',
        icon: 'bi-building',
        colorClass: 'bg-success',
      },
      {
        title: 'Equipos',
        value: 124,
        subtitle: 'Totales',
        icon: 'bi-cpu',
        colorClass: 'bg-warning',
      },
      {
        title: 'Préstamos',
        value: 3,
        subtitle: 'Pendientes',
        icon: 'bi-box-arrow-in-right',
        colorClass: 'bg-danger',
      },
    ];

    // Reservas recientes (demo)
    this.recentReservations = [
      {
        id: 1,
        lab: 'Redes A-101',
        user: 'María Pérez',
        start: '2025-10-23 09:00',
        end: '2025-10-23 11:00',
        status: 'Confirmada',
      },
      {
        id: 2,
        lab: 'Prog B-202',
        user: 'Juan López',
        start: '2025-10-23 12:00',
        end: '2025-10-23 14:00',
        status: 'Pendiente',
      },
      {
        id: 3,
        lab: 'Electrónica C-303',
        user: 'Ana Ruiz',
        start: '2025-10-24 08:00',
        end: '2025-10-24 10:00',
        status: 'Cancelada',
      },
    ];

    // Préstamos (demo) + alertas derivadas
    this.loadLoansDemo();
  }

  // ====== Navegación / Acciones existentes ======
  goCreateReservation(): void {
    this.router.navigate(['/reservations/new']);
  }
  goLabs(): void {
    this.router.navigate(['/labs']);
  }
  viewReservation(id: number | string): void {
    this.router.navigate(['/reservations/edit', id]);
  }

  // ====== Nuevos métodos para funcionalidades añadidas ======
  goCreateLoan(): void {
    this.router.navigate(['/loans/new']);
  }
  viewLoan(id: string): void {
    this.router.navigate(['/loans/view', id]);
  }
  registerReturn(id: string): void {
    this.router.navigate(['/loans/return', id]);
  }
  goReports(): void {
    this.router.navigate(['/reports']);
  }
  goAlerts(): void {
    this.router.navigate(['/admin/alerts']);
  }

  // ====== Demo de préstamos + cálculo de KPIs/alertas ======
  private loadLoansDemo() {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const minus1d = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
        d.getHours()
      )}:${pad(d.getMinutes())}`;

    this.recentLoans = [
      {
        id: 'L-1',
        equipment: 'Osciloscopio 100MHz',
        user: 'Luis Mora',
        loanDate: fmt(minus1d),
        dueDate: fmt(in24h),
        status: 'Aprobado',
        dueSoon: true,
      },
      {
        id: 'L-2',
        equipment: 'Proyector Aulas',
        user: 'Carla Pérez',
        loanDate: fmt(now),
        dueDate: fmt(minus1d),
        status: 'Tarde',
        isLate: true,
      },
      {
        id: 'L-3',
        equipment: 'Kit Arduino x2',
        user: 'Ana Ruiz',
        loanDate: fmt(now),
        dueDate: fmt(in24h),
        status: 'Pendiente',
      },
    ];

    this.loansSummary = {
      pending: this.recentLoans.filter((l) => l.status === 'Pendiente').length,
      dueSoon: this.recentLoans.filter((l) => l.dueSoon && !l.isLate).length,
      late: this.recentLoans.filter((l) => l.isLate).length,
    };

    // Si no vienen del backend, generamos alertas rápidas
    this.alerts = [];
    if (this.loansSummary.late)
      this.alerts.push({
        text: `${this.loansSummary.late} devolución(es) retrasada(s)`,
      });
    if (this.loansSummary.dueSoon)
      this.alerts.push({
        text: `${this.loansSummary.dueSoon} préstamo(s) vencen en 48h`,
      });
  }
}
