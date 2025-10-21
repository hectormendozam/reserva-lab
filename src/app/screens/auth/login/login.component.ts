import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
selector: 'app-login',
templateUrl: './login.component.html',
styleUrls: ['./login.component.scss']
})
export class LoginComponent {
form: FormGroup;
constructor(private fb: FormBuilder){
this.form = this.fb.group({
correo: ['', [Validators.required, Validators.email]],
password: ['', [Validators.required, Validators.minLength(6)]]
});
}


submit(){
if(this.form.invalid) return;
// TODO: llamar AuthService.login
console.log('login', this.form.value);
}
}