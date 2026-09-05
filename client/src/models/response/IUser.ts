export interface IUser{
  id?: string;
  name?: string;
  email?: string;
  password_hash?: string;
  created_at?: string;
  position?: string;
  is_activated?: boolean;
  activation_link?: string
}
