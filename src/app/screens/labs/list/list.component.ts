import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


interface Lab { id: number; nombre: string; ubicacion: string; capacidad: number; }


@Component({
selector: 'app-labs-list',
templateUrl: './list.component.html',
styleUrls: ['./list.component.scss']
})
export class LabsListComponent implements OnInit{
labs: Lab[] = [];


ngOnInit(){
// TODO: reemplazar por LabsService.getAll()
this.labs = [
{id:1, nombre:'Laboratorio de Redes', ubicacion:'A-101', capacidad:20},
{id:2, nombre:'Laboratorio de Programación', ubicacion:'B-202', capacidad:30}
];
}
}