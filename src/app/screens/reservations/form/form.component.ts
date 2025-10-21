import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({ selector:'app-reservations-form', templateUrl:'./form.component.html', styleUrls:['./form.component.scss'] })
export class ReservationsFormComponent{
form: FormGroup;
labs = [ {id:1, nombre:'Lab Redes'}, {id:2, nombre:'Lab Prog'} ];


constructor(private fb: FormBuilder){
this.form = this.fb.group({
labId: [null, Validators.required],
start: ['', Validators.required],
end: ['', Validators.required],
motivo: ['']
});
}


submit(){
if(this.form.invalid) return;
console.log('reserve', this.form.value);
}
}