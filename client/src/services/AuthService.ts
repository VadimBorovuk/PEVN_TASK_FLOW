import $api from "@/http";
import type {AxiosResponse} from "axios";
import type {AuthResponse} from "@/models/response/AuthResponse.ts";
import type {TypeAuthLogin, TypeAuthRegistration} from "@/models/types/auth.ts";


export default class AuthService {
  static async login(body: TypeAuthLogin): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/user/login', body)
    // .then(response=> response.data.)
  }

  static async registration(body: TypeAuthRegistration): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/user/registration', body)
    // .then(response=> response.data.)
  }

  static async logout(): Promise<void> {
    return $api.post('/user/logout')
    // .then(response=> response.data.)
  }

  static async refresh(): Promise<AxiosResponse<AuthResponse>> {
    return $api.get<AuthResponse>('/user/refresh')
    // .then(response=> response.data.)
  }
}

