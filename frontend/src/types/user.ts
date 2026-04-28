export interface BackendUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'customer' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}
