import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Loan, CreateLoanDto, LoanStatus } from '../shared/models/loan.model';

const API_BASE = '/api';
const USE_MOCK = true;
const LS_LOANS = 'loans_mock';

@Injectable({ providedIn: 'root' })
export class LoansService {
  private api = `${API_BASE}/loans`;
  constructor(private http: HttpClient) {}

  list(opts?: {
    q?: string;
    status?: LoanStatus;
    due?: 'LATE' | 'DUE_SOON' | '';
  }): Observable<Loan[]> {
    if (USE_MOCK) {
      const all: Loan[] = JSON.parse(localStorage.getItem(LS_LOANS) || '[]');
      let res = [...all];

      if (opts?.q) {
        const q = opts.q.toLowerCase();
        res = res.filter((l) => (l.notes || '').toLowerCase().includes(q));
      }
      if (opts?.status) res = res.filter((l) => l.status === opts.status);

      if (opts?.due) {
        const today = new Date().toISOString().slice(0, 10);
        if (opts.due === 'LATE')
          res = res.filter(
            (l) => l.due_date < today && l.status !== 'RETURNED'
          );
        if (opts.due === 'DUE_SOON') {
          const in2 = new Date(Date.now() + 2 * 86400000)
            .toISOString()
            .slice(0, 10);
          res = res.filter(
            (l) =>
              l.due_date <= in2 &&
              l.due_date >= today &&
              l.status !== 'RETURNED'
          );
        }
      }

      // orden por due_date asc (más urgentes arriba)
      res.sort((a, b) => (a.due_date > b.due_date ? 1 : -1));
      return of(res).pipe(delay(120));
    }

    let params = new HttpParams();
    if (opts?.q) params = params.set('q', opts.q);
    if (opts?.status) params = params.set('status', opts.status);
    if (opts?.due) params = params.set('due', opts.due);
    return this.http.get<Loan[]>(this.api, { params });
  }

  getById(id: string): Observable<Loan> {
    if (USE_MOCK) {
      const all: Loan[] = JSON.parse(localStorage.getItem(LS_LOANS) || '[]');
      return of(all.find((l) => l.id === id)!).pipe(delay(100));
    }
    return this.http.get<Loan>(`${this.api}/${id}`);
  }

  create(dto: CreateLoanDto): Observable<Loan> {
    if (USE_MOCK) {
      const all: Loan[] = JSON.parse(localStorage.getItem(LS_LOANS) || '[]');
      const newLoan: Loan = {
        id: `loan-${Date.now()}`,
        requester_id: 'me', // mock
        status: 'PENDING',
        created_at: new Date().toISOString(),
        ...dto,
      };
      all.push(newLoan);
      localStorage.setItem(LS_LOANS, JSON.stringify(all));
      return of(newLoan).pipe(delay(120));
    }
    return this.http.post<Loan>(this.api, dto);
  }

  updateStatus(id: string, status: LoanStatus): Observable<Loan> {
    if (USE_MOCK) {
      const all: Loan[] = JSON.parse(localStorage.getItem(LS_LOANS) || '[]');
      const idx = all.findIndex((l) => l.id === id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], status };
        localStorage.setItem(LS_LOANS, JSON.stringify(all));
      }
      return of(all[idx]).pipe(delay(100));
    }
    return this.http.patch<Loan>(`${this.api}/${id}/status`, { status });
  }

  remove(id: string): Observable<void> {
    if (USE_MOCK) {
      const all: Loan[] = JSON.parse(localStorage.getItem(LS_LOANS) || '[]');
      const next = all.filter((l) => l.id !== id);
      localStorage.setItem(LS_LOANS, JSON.stringify(next));
      return of(void 0).pipe(delay(80));
    }
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
