export interface User {
  id: string;
  nombre: string;
  apellidos: string;
  matricula: string;
  correo: string;
  rol: 'Admin'|'Technician'|'Student';
  fotoUrl?: string;
}
