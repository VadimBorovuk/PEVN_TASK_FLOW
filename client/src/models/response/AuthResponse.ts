import type {IUser} from "@/models/response/IUser.ts";

export interface AuthResponse{
  accessToken: string;
  refreshToken: string;
  user_info: IUser;
}
