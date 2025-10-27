// src/app/shared/models/lab.model.ts
export type LabStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export interface Lab {
  id: string;
  name: string;
  building?: string;
  floor?: string;
  capacity?: number;
  kind: 'Cómputo' | 'Electrónica' | 'Biología' | string;
  status: LabStatus;
  created_at?: string;
}

export interface OperatingHour {
  id?: string;
  lab_id?: string;
  weekday: number; // 0=Dom, 1=Lun,...6=Sáb
  start_at: string; // "08:00"
  end_at: string; // "18:00"
  enabled: boolean;
}
