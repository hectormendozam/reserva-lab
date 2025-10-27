export type LoanStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'RETURNED'
  | 'DAMAGED';

export interface Loan {
  id: string;
  requester_id: string;
  equipment_id: string;
  qty: number;
  loan_date: string; // YYYY-MM-DD
  due_date: string; // YYYY-MM-DD
  status: LoanStatus;
  notes?: string;
  created_at?: string;
}

export interface CreateLoanDto {
  equipment_id: string;
  qty: number;
  loan_date: string; // YYYY-MM-DD
  due_date: string; // YYYY-MM-DD
  notes?: string;
}
