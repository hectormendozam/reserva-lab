// src/app/services/reservations.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Reservation,
  CreateReservationDto,
  ReservationStatus,
} from '../shared/models/reservation.model';

const API_BASE = '/api';
const USE_MOCK = true; // ← cuando tengas backend real, pon false
const LS_KEY = 'reservation_drafts';

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private api = `${API_BASE}/reservations`;
  constructor(private http: HttpClient) {}

  list(opts?: {
    q?: string;
    status?: ReservationStatus;
    date?: string;
  }): Observable<Reservation[]> {
    if (USE_MOCK) {
      const all: Reservation[] = JSON.parse(
        localStorage.getItem(LS_KEY) || '[]'
      );
      let res = [...all];
      if (opts?.q) {
        const q = opts.q.toLowerCase();
        res = res.filter((r) => (r.purpose || '').toLowerCase().includes(q));
      }
      if (opts?.status) res = res.filter((r) => r.status === opts.status);
      if (opts?.date) res = res.filter((r) => r.date === opts.date);
      // orden desc por fecha/hora
      res.sort((a, b) =>
        `${a.date} ${a.start_time}` < `${b.date} ${b.start_time}` ? 1 : -1
      );
      return of(res).pipe(delay(150));
    }

    let params = new HttpParams();
    if (opts?.q) params = params.set('q', opts.q);
    if (opts?.status) params = params.set('status', opts.status);
    if (opts?.date) params = params.set('date', opts.date);
    return this.http.get<Reservation[]>(this.api, { params });
  }

  getById(id: string): Observable<Reservation> {
    if (USE_MOCK) {
      const all: Reservation[] = JSON.parse(
        localStorage.getItem(LS_KEY) || '[]'
      );
      const found = all.find((r) => r.id === id)!;
      return of(found).pipe(delay(120));
    }
    return this.http.get<Reservation>(`${this.api}/${id}`);
  }

  create(dto: CreateReservationDto): Observable<Reservation> {
    if (USE_MOCK) {
      const all: Reservation[] = JSON.parse(
        localStorage.getItem(LS_KEY) || '[]'
      );
      const newRes: Reservation = {
        id: `res-${Date.now()}`,
        requester_id: 'me', // mock
        status: 'PENDING',
        created_at: new Date().toISOString(),
        ...dto,
      };
      all.push(newRes);
      localStorage.setItem(LS_KEY, JSON.stringify(all));
      return of(newRes).pipe(delay(150));
    }
    return this.http.post<Reservation>(this.api, dto);
  }

  updateStatus(id: string, status: ReservationStatus): Observable<Reservation> {
    if (USE_MOCK) {
      const all: Reservation[] = JSON.parse(
        localStorage.getItem(LS_KEY) || '[]'
      );
      const idx = all.findIndex((r) => r.id === id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], status };
        localStorage.setItem(LS_KEY, JSON.stringify(all));
      }
      return of(all[idx]).pipe(delay(120));
    }
    return this.http.patch<Reservation>(`${this.api}/${id}/status`, { status });
  }

  remove(id: string): Observable<void> {
    if (USE_MOCK) {
      const all: Reservation[] = JSON.parse(
        localStorage.getItem(LS_KEY) || '[]'
      );
      const next = all.filter((r) => r.id !== id);
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return of(void 0).pipe(delay(120));
    }
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
