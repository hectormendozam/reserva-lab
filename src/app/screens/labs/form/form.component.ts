import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
selector: 'app-labs-form',
templateUrl: './form.component.html',
styleUrls: ['./form.component.scss']
})
export class LabsFormComponent{
form: FormGroup;
constructor(private fb: FormBuilder){
this.form = this.fb.group({
nombre: ['', Validators.required],
ubicacion: ['', Validators.required],
capacidad: [1, [Validators.required, Validators.min(1)]]
});
}


submit(){
if(this.form.invalid) return;
// TODO: labsService.create/update
console.log(this.form.value);
}
}