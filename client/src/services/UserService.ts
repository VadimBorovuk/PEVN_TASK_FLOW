import $api from "@/http";
import type { AxiosResponse } from "axios";
import type {IUser} from "@/models/response/IUser.ts";

export default class UserService {
  static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return $api.get<IUser[]>('/user')
  }
}

