export type EquipmentStatus = 'AVAILABLE' | 'MAINTENANCE' | 'RETIRED';

export interface Equipment {
  id: string;
  name: string;
  description?: string;
  inventory_no?: string;
  total_qty: number;
  available_qty: number;
  status: EquipmentStatus;
  lab_id?: string;
  created_at?: string;
}
