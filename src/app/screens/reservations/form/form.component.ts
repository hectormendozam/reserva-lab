import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LabsService } from '../../../services/labs.service';
import { Lab } from '../../../shared/models/lab.model';
import { CreateReservationDto } from '../../../shared/models/reservation.model';
import { ReservationsService } from '../../../services/reservations.service';

@Component({
  selector: 'app-reservations-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class ReservationsFormComponent implements OnInit {
  loading = false;
  labs: Lab[] = [];

  // Form con validaciones básicas y validador de rango horario
  form: FormGroup = this.fb.group(
    {
      lab_id: ['', [Validators.required]],
      date: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      purpose: ['', [Validators.required, Validators.maxLength(240)]],
    },
    { validators: [timeRangeValidator] }
  );

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private labsSvc: LabsService,
    private reservationsSvc: ReservationsService
  ) {}

  ngOnInit(): void {
    this.labsSvc.list().subscribe((labs: Lab[]) => {
      this.labs = labs;
    });
  }

  touched(controlName: string) {
    const c = this.form.get(controlName);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  submit() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload: CreateReservationDto = this.form
      .value as CreateReservationDto;

    this.reservationsSvc.create(payload).subscribe({
      next: () => {
        alert('Reserva guardada.');
        this.router.navigate(['/reservations']); // vuelve al listado
      },
      error: (err) => {
        console.error(err);
        alert('Error al guardar la reserva.');
      },
      complete: () => (this.loading = false),
    });
  }

  goBack() {
    this.router.navigate(['/reservations']);
  }

  cancel() {
    this.router.navigate(['/reservations']);
  }
}

/** Validador simple: start_time < end_time */
function timeRangeValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('start_time')?.value;
  const end = group.get('end_time')?.value;
  if (!start || !end) return null;
  return start < end ? null : { timeRange: true };
}
