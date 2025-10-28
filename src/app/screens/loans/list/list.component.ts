import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoansService } from '../../../services/loans.service';
import { EquipmentService } from '../../../services/equipment.service';
import { Loan, LoanStatus } from '../../../shared/models/loan.model';
import { Equipment } from '../../../shared/models/equipment.model';

@Component({
  selector: 'app-loans-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  loading = true;
  q = '';
  status = '';
  due: '' | 'DUE_SOON' | 'LATE' = '';

  data: Loan[] = [];
  equipment: Equipment[] = [];

  constructor(
    private router: Router,
    private loansSvc: LoansService,
    private equipSvc: EquipmentService
  ) {}

  ngOnInit(): void {
    this.equipSvc.list().subscribe((eq) => (this.equipment = eq));
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.loansSvc
      .list({
        q: this.q || undefined,
        status: (this.status as LoanStatus) || undefined,
        due: this.due || undefined,
      })
      .subscribe((res) => {
        this.data = res;
        this.loading = false;
      });
  }

  clear() {
    this.q = '';
    this.status = '';
    this.due = '';
    this.refresh();
  }

  equipName(id: string): string {
    const e = this.equipment.find((x) => x.id === id);
    return e ? e.name : id;
  }

  isLate(l: Loan): boolean {
    const today = new Date().toISOString().slice(0, 10);
    return l.due_date < today && l.status !== 'RETURNED';
    // si quieres ver solo fecha, podrías mejorar comparando como Date
  }

  isDueSoon(l: Loan): boolean {
    const today = new Date().toISOString().slice(0, 10);
    const in2 = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
    return l.due_date <= in2 && l.due_date >= today && l.status !== 'RETURNED';
  }

  mapStatus(s: LoanStatus) {
    switch (s) {
      case 'PENDING':
        return 'Pendiente';
      case 'APPROVED':
        return 'Aprobado';
      case 'REJECTED':
        return 'Rechazado';
      case 'RETURNED':
        return 'Devuelto';
      case 'DAMAGED':
        return 'Dañado';
      default:
        return s;
    }
  }

  goCreate() {
    this.router.navigate(['/loans/new']);
  }
  view(id: string) {
    /* opcional: this.router.navigate(['/loans/view', id]); */
  }

  markReturned(id: string) {
    this.loansSvc.updateStatus(id, 'RETURNED').subscribe(() => this.refresh());
  }

  markDamaged(id: string) {
    this.loansSvc.updateStatus(id, 'DAMAGED').subscribe(() => this.refresh());
  }
}
