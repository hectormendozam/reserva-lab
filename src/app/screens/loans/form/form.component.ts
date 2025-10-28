import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';

import { EquipmentService } from '../../../services/equipment.service';
import { LoansService } from '../../../services/loans.service';
import { Equipment } from '../../../shared/models/equipment.model';
import { CreateLoanDto } from '../../../shared/models/loan.model';

@Component({
  selector: 'app-loans-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  loading = false;
  equipment: Equipment[] = [];

  form: FormGroup = this.fb.group(
    {
      equipment_id: ['', Validators.required],
      qty: [1, [Validators.required, Validators.min(1)]],
      loan_date: ['', Validators.required],
      due_date: ['', Validators.required],
      notes: [''],
    },
    { validators: [dateRangeValidator] }
  );

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private equipSvc: EquipmentService,
    private loansSvc: LoansService
  ) {}

  ngOnInit(): void {
    this.equipSvc.list().subscribe((e) => (this.equipment = e));
    // validador de disponibilidad reactivo
    this.form
      .get('qty')
      ?.valueChanges.subscribe(() => this.checkAvailability());
    this.form
      .get('equipment_id')
      ?.valueChanges.subscribe(() => this.checkAvailability());
  }

  t(c: string) {
    const ctrl = this.form.get(c);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  private checkAvailability() {
    const eqId = this.form.get('equipment_id')?.value;
    const qty = Number(this.form.get('qty')?.value);
    if (!eqId || !qty) return;

    const eq = this.equipment.find((e) => e.id === eqId);
    if (!eq) return;

    if (qty > eq.available_qty || qty <= 0) {
      this.form.get('qty')?.setErrors({ availability: true });
    } else {
      // si solo tenía availability como error, lo quitamos
      const errs = this.form.get('qty')?.errors || {};
      delete (errs as any)['availability'];
      this.form.get('qty')?.setErrors(Object.keys(errs).length ? errs : null);
    }
  }

  submit() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    const payload: CreateLoanDto = this.form.value as CreateLoanDto;

    this.loansSvc.create(payload).subscribe({
      next: () => {
        alert('Solicitud de préstamo guardada.');
        this.router.navigate(['/loans']);
      },
      error: () => alert('Error al guardar el préstamo.'),
      complete: () => (this.loading = false),
    });
  }

  goBack() {
    this.router.navigate(['/loans']);
  }
}

function dateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const a = group.get('loan_date')?.value;
  const b = group.get('due_date')?.value;
  if (!a || !b) return null;
  return a < b ? null : { dateRange: true };
}
