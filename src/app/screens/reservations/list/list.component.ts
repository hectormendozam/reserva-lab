import { Component, OnInit } from '@angular/core';


interface Reservation { id:number; lab:string; start: string; end:string; estado:string; }


@Component({ selector:'app-reservations-list', templateUrl:'./list.component.html', styleUrls:['./list.component.scss'] })
export class ReservationsListComponent implements OnInit{
reservations: Reservation[] = [];
ngOnInit(){
// TODO: reservationsService.getAll()
this.reservations = [
{id:1, lab:'Lab Redes', start:'2025-10-21 09:00', end:'2025-10-21 11:00', estado:'Pendiente'}
];
}
}