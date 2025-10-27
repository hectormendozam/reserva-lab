import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  loading = false;

  constructor(private fb: FormBuilder) {}

  // Validaciones básicas: requerido + longitudes
  form: FormGroup = this.fb.group({
    first_name: ['', [Validators.required, Validators.maxLength(80)]],
    last_name: ['', [Validators.required, Validators.maxLength(80)]],
    student_id: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(40)],
    ],
    department: ['', [Validators.required, Validators.maxLength(120)]],
    correo: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(120)],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(64)],
    ],
    confirm: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(64)],
    ],
  });

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
    const payload = this.form.value;

    // Provisional: guarda el borrador local y muestra en consola.
    try {
      localStorage.setItem('register_draft', JSON.stringify(payload));
      console.log('Registro (provisional) ->', payload);
      alert('Registro provisional guardado localmente. (Sin backend)');
    } finally {
      this.loading = false;
    }
  }
}
