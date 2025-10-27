import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Equipment } from '../shared/models/equipment.model';

const API_BASE = '/api';
const USE_MOCK = true;
const LS_EQUIP = 'equipments_mock';

function seedEquipIfEmpty() {
  if (!localStorage.getItem(LS_EQUIP)) {
    const seed: Equipment[] = [
      {
        id: 'eq-osc100',
        name: 'Osciloscopio 100MHz',
        description: 'Rigol DS1102E',
        total_qty: 6,
        available_qty: 4,
        status: 'AVAILABLE',
      },
      {
        id: 'eq-proy1',
        name: 'Proyector Aula',
        description: 'Epson XGA',
        total_qty: 3,
        available_qty: 1,
        status: 'AVAILABLE',
      },
      {
        id: 'eq-ardk2',
        name: 'Kit Arduino',
        description: 'Uno R3 x2',
        total_qty: 10,
        available_qty: 0,
        status: 'MAINTENANCE',
      },
    ];
    localStorage.setItem(LS_EQUIP, JSON.stringify(seed));
  }
}
if (USE_MOCK) seedEquipIfEmpty();

@Injectable({ providedIn: 'root' })
export class EquipmentService {
  private api = `${API_BASE}/equipment`;
  constructor(private http: HttpClient) {}

  list(opts?: { q?: string; status?: string }): Observable<Equipment[]> {
    if (USE_MOCK) {
      const all: Equipment[] = JSON.parse(
        localStorage.getItem(LS_EQUIP) || '[]'
      );
      let res = [...all];
      if (opts?.q) {
        const q = opts.q.toLowerCase();
        res = res.filter((e) =>
          [e.name, e.description, e.inventory_no]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))
        );
      }
      if (opts?.status) res = res.filter((e) => e.status === opts.status);
      return of(res).pipe(delay(120));
    }
    let params = new HttpParams();
    if (opts?.q) params = params.set('q', opts.q);
    if (opts?.status) params = params.set('status', opts.status);
    return this.http.get<Equipment[]>(this.api, { params });
  }

  getById(id: string): Observable<Equipment> {
    if (USE_MOCK) {
      const all: Equipment[] = JSON.parse(
        localStorage.getItem(LS_EQUIP) || '[]'
      );
      const found = all.find((e) => e.id === id)!;
      return of(found).pipe(delay(100));
    }
    return this.http.get<Equipment>(`${this.api}/${id}`);
  }

  // utilidades mock para ajustar stock cuando se aprueba o devuelve
  adjustAvailability(id: string, delta: number): Observable<Equipment> {
    if (USE_MOCK) {
      const all: Equipment[] = JSON.parse(
        localStorage.getItem(LS_EQUIP) || '[]'
      );
      const idx = all.findIndex((e) => e.id === id);
      if (idx >= 0) {
        const next = Math.max(
          0,
          Math.min(all[idx].total_qty, all[idx].available_qty + delta)
        );
        all[idx] = { ...all[idx], available_qty: next };
        localStorage.setItem(LS_EQUIP, JSON.stringify(all));
      }
      return of(all[idx]).pipe(delay(80));
    }
    // en backend real, esto se maneja del lado del servidor
    return this.getById(id);
  }
}
