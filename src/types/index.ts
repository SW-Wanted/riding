export type UserRole = 'admin' | 'driver' | 'student';

export type ShiftType = 'morning_go' | 'morning_return' | 'afternoon_go' | 'afternoon_return' | 'night_return';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid';

export type PaymentType = 'daily' | 'weekly' | 'monthly';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  student_number?: string;
  university_id?: string;
  created_at: string;
  updated_at: string;
}

export interface University {
  id: string;
  name: string;
  email_domain: string;
  address: string;
  active: boolean;
  created_at: string;
}

export interface Route {
  id: string;
  name: string;
  order_index: number;
  is_destination: boolean;
  active: boolean;
  created_at: string;
}

export interface Schedule {
  id: string;
  university_id: string;
  route_id: string;
  shift: ShiftType;
  departure_time: string;
  days_of_week: string[];
  capacity: number;
  active: boolean;
  created_at: string;
}

export interface Vehicle {
  id: string;
  plate_number: string;
  model: string;
  capacity: number;
  driver_id?: string;
  active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  student_id: string;
  schedule_id: string;
  booking_date: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  check_in_time?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  student_id: string;
  payment_type: PaymentType;
  amount: number;
  start_date: string;
  end_date: string;
  status: string;
  payment_method?: string;
  created_at: string;
}
