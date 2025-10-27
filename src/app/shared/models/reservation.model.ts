export type ReservationStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export interface Reservation {
  id: string;
  requester_id: string;
  lab_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  purpose?: string;
  status: ReservationStatus;
  created_at?: string;
}

export interface CreateReservationDto {
  lab_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  purpose: string; // 1–240 chars
}

export interface UpdateReservationStatusDto {
  status: ReservationStatus;
}
