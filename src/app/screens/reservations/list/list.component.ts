import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Reservation,
  ReservationStatus,
} from '../../../shared/models/reservation.model';
import { LabsService } from '../../../services/labs.service';
import { Lab } from '../../../shared/models/lab.model';

type DraftReservation = Reservation | (Reservation & { id: string });

@Component({
  selector: 'app-reservations-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ReservationsListComponent implements OnInit {
  loading = true;

  // datos crudos (provisional: localStorage)
  all: DraftReservation[] = [];

  // filtros
  q = '';
  status = '';
  date = '';

  // render
  filtered: DraftReservation[] = [];
  labs: Lab[] = [];

  // paginación simple
  pageSize = 5;
  pageIndex = 0;
  page: DraftReservation[] = [];
  get pageStart() {
    return this.pageIndex * this.pageSize;
  }
  get pageEnd() {
    return Math.min(this.pageStart + this.pageSize, this.filtered.length);
  }

  constructor(private router: Router, private labsSvc: LabsService) {}

  ngOnInit(): void {
    // labs (para mostrar el nombre desde el id)
    this.labsSvc.list().subscribe((labs: Lab[]) => (this.labs = labs));

    // cargar reservas desde LocalStorage (provisional)
    const drafts = JSON.parse(
      localStorage.getItem('reservation_drafts') || '[]'
    );
    // normaliza: orden por fecha/hora descendente
    this.all = (drafts as DraftReservation[]).sort((a, b) => {
      const aKey = `${a.date} ${a.start_time}`;
      const bKey = `${b.date} ${b.start_time}`;
      return aKey < bKey ? 1 : -1;
    });

    this.applyFilters();
    this.loading = false;
  }

  // === Filtros y helpers ===
  applyFilters() {
    const q = this.q.trim().toLowerCase();
    const s = this.status as ReservationStatus | '';

    this.filtered = this.all.filter((r) => {
      const matchesQ =
        !q ||
        this.labName(r.lab_id).toLowerCase().includes(q) ||
        (r.purpose?.toLowerCase().includes(q) ?? false);

      const matchesStatus = !s || r.status === s;
      const matchesDate = !this.date || r.date === this.date;

      return matchesQ && matchesStatus && matchesDate;
    });

    this.pageIndex = 0;
    this.page = this.filtered.slice(this.pageStart, this.pageEnd);
  }

  clearFilters() {
    this.q = '';
    this.status = '';
    this.date = '';
    this.applyFilters();
  }

  prev() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.page = this.filtered.slice(this.pageStart, this.pageEnd);
    }
  }
  next() {
    if ((this.pageIndex + 1) * this.pageSize < this.filtered.length) {
      this.pageIndex++;
      this.page = this.filtered.slice(this.pageStart, this.pageEnd);
    }
  }

  labName(id: string): string {
    const lab = this.labs.find((l) => l.id === id);
    return lab ? lab.name : id;
    // si quieres mostrar también "— kind": `${lab?.name} — ${lab?.kind}`
  }

  mapStatus(s: ReservationStatus): string {
    switch (s) {
      case 'PENDING':
        return 'Pendiente';
      case 'APPROVED':
        return 'Aprobada';
      case 'REJECTED':
        return 'Rechazada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return s;
    }
  }

  // === Acciones ===
  goCreate() {
    this.router.navigate(['/reservations/new']);
  }
  view(id: string | number) {
    this.router.navigate(['/reservations/edit', id]);
  }
  edit(id: string | number) {
    this.router.navigate(['/reservations/edit', id]);
  }

  cancel(id: string | number) {
    // Provisional: marcar CANCELLED en localStorage
    const idx = this.all.findIndex((r) => r.id === id);
    if (idx < 0) return;

    this.all[idx] = { ...this.all[idx], status: 'CANCELLED' };
    localStorage.setItem('reservation_drafts', JSON.stringify(this.all));
    this.applyFilters();
  }
}
