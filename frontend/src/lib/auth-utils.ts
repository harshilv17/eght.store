import { AuthUser } from "@/store/auth.store";
import { BackendUser } from "@/types/user";

export function mapUser(raw: BackendUser): AuthUser {
  return {
    id: raw.id,
    email: raw.email,
    firstName: raw.first_name,
    lastName: raw.last_name,
    role: raw.role,
  };
}
