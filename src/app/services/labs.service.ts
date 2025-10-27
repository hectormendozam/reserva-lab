// src/app/services/labs.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Lab, OperatingHour } from '../shared/models/lab.model'; // 👈 modelos compartidos

const API_BASE = '/api';
const USE_MOCK = true;
const LS_LABS = 'labs_mock';
const LS_HOURS = 'lab_hours_mock';

function seedIfEmpty() {
  if (!localStorage.getItem(LS_LABS)) {
    const seed: Lab[] = [
      {
        id: 'lab-a101',
        name: 'Redes A-101',
        kind: 'Cómputo',
        status: 'ACTIVE',
        building: 'A',
        floor: '1',
        capacity: 24,
      },
      {
        id: 'lab-b202',
        name: 'Prog B-202',
        kind: 'Cómputo',
        status: 'ACTIVE',
        building: 'B',
        floor: '2',
        capacity: 30,
      },
      {
        id: 'lab-c303',
        name: 'Electrónica C-303',
        kind: 'Electrónica',
        status: 'MAINTENANCE',
        building: 'C',
        floor: '3',
        capacity: 18,
      },
    ];
    localStorage.setItem(LS_LABS, JSON.stringify(seed));
  }
  if (!localStorage.getItem(LS_HOURS)) {
    const hours: Record<string, OperatingHour[]> = {
      'lab-a101': [
        { weekday: 1, start_at: '08:00', end_at: '18:00', enabled: true },
        { weekday: 2, start_at: '08:00', end_at: '18:00', enabled: true },
        { weekday: 3, start_at: '08:00', end_at: '18:00', enabled: true },
        { weekday: 4, start_at: '08:00', end_at: '18:00', enabled: true },
        { weekday: 5, start_at: '08:00', end_at: '16:00', enabled: true },
      ],
      'lab-b202': [
        { weekday: 1, start_at: '09:00', end_at: '17:00', enabled: true },
        { weekday: 3, start_at: '09:00', end_at: '17:00', enabled: true },
        { weekday: 5, start_at: '09:00', end_at: '15:00', enabled: true },
      ],
      'lab-c303': [
        { weekday: 2, start_at: '10:00', end_at: '14:00', enabled: false },
      ],
    };
    localStorage.setItem(LS_HOURS, JSON.stringify(hours));
  }
}
if (USE_MOCK) seedIfEmpty();

@Injectable({ providedIn: 'root' })
export class LabsService {
  private api = `${API_BASE}/labs`;
  constructor(private http: HttpClient) {}

  list(opts?: {
    q?: string;
    status?: string;
    kind?: string;
  }): Observable<Lab[]> {
    if (USE_MOCK) {
      const all: Lab[] = JSON.parse(localStorage.getItem(LS_LABS) || '[]');
      let filtered = all;
      if (opts?.q) {
        const q = opts.q.toLowerCase();
        filtered = filtered.filter((l) =>
          [l.name, l.building, l.floor, l.kind]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))
        );
      }
      if (opts?.status)
        filtered = filtered.filter((l) => l.status === opts.status);
      if (opts?.kind) filtered = filtered.filter((l) => l.kind === opts.kind);
      return of(filtered).pipe(delay(200));
    }

    let params = new HttpParams();
    if (opts?.q) params = params.set('q', opts.q);
    if (opts?.status) params = params.set('status', opts.status);
    if (opts?.kind) params = params.set('kind', opts.kind);
    return this.http.get<Lab[]>(this.api, { params });
  }

  getById(id: string): Observable<Lab> {
    if (USE_MOCK) {
      const all: Lab[] = JSON.parse(localStorage.getItem(LS_LABS) || '[]');
      const found = all.find((l) => l.id === id)!;
      return of(found).pipe(delay(150));
    }
    return this.http.get<Lab>(`${this.api}/${id}`);
  }

  create(dto: Omit<Lab, 'id' | 'created_at'>): Observable<Lab> {
    if (USE_MOCK) {
      const all: Lab[] = JSON.parse(localStorage.getItem(LS_LABS) || '[]');
      const newLab: Lab = { ...dto, id: `lab-${Date.now()}` };
      all.push(newLab);
      localStorage.setItem(LS_LABS, JSON.stringify(all));
      return of(newLab).pipe(delay(200));
    }
    return this.http.post<Lab>(this.api, dto);
  }

  update(id: string, patch: Partial<Lab>): Observable<Lab> {
    if (USE_MOCK) {
      const all: Lab[] = JSON.parse(localStorage.getItem(LS_LABS) || '[]');
      const idx = all.findIndex((l) => l.id === id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...patch };
        localStorage.setItem(LS_LABS, JSON.stringify(all));
      }
      return of(all[idx]).pipe(delay(200));
    }
    return this.http.patch<Lab>(`${this.api}/${id}`, patch);
  }

  remove(id: string): Observable<void> {
    if (USE_MOCK) {
      const all: Lab[] = JSON.parse(localStorage.getItem(LS_LABS) || '[]');
      const next = all.filter((l) => l.id !== id);
      localStorage.setItem(LS_LABS, JSON.stringify(next));
      const hours = JSON.parse(localStorage.getItem(LS_HOURS) || '{}');
      delete hours[id];
      localStorage.setItem(LS_HOURS, JSON.stringify(hours));
      return of(void 0).pipe(delay(150));
    }
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  getOperatingHours(labId: string): Observable<OperatingHour[]> {
    if (USE_MOCK) {
      const hours: Record<string, OperatingHour[]> = JSON.parse(
        localStorage.getItem(LS_HOURS) || '{}'
      );
      return of(hours[labId] || []).pipe(delay(150));
    }
    return this.http.get<OperatingHour[]>(
      `${this.api}/${labId}/operating-hours`
    );
  }

  setOperatingHours(
    labId: string,
    hours: OperatingHour[]
  ): Observable<OperatingHour[]> {
    if (USE_MOCK) {
      const map: Record<string, OperatingHour[]> = JSON.parse(
        localStorage.getItem(LS_HOURS) || '{}'
      );
      map[labId] = hours.map((h) => ({ ...h, lab_id: labId }));
      localStorage.setItem(LS_HOURS, JSON.stringify(map));
      return of(map[labId]).pipe(delay(200));
    }
    return this.http.put<OperatingHour[]>(
      `${this.api}/${labId}/operating-hours`,
      hours
    );
  }

  setStatus(id: string, status: Lab['status']): Observable<Lab> {
    return this.update(id, { status });
  }

  suggest(q: string): Observable<Lab[]> {
    return this.list({ q }).pipe(map((list) => list.slice(0, 8)));
  }
}
