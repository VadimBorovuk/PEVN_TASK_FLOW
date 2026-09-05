import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import axios, { isAxiosError } from 'axios'
import type { IUser } from "@/models/response/IUser.ts"
import AuthService from "@/services/AuthService.ts"
import type { TypeAuthLogin, TypeAuthRegistration } from "@/models/types/auth.ts"
import { API_URL } from "@/http"
import type { AuthResponse } from "@/models/response/AuthResponse.ts"
import UserService from "@/services/UserService.ts"
import { isTokenExpired } from "@/utils/jwt.ts"

export const useUserStore = defineStore('User', () => {
  const isAuth = ref(false)
  const authChecked = ref(false)
  const user = ref<IUser>({})
  const usersData = ref<IUser[]>([])
  const formLogin = reactive<TypeAuthLogin>({
    email: null,
    password: null
  })

  const formRegistration = reactive<TypeAuthRegistration>({
    email: null,
    password: null,
    position: 'guest',
    name: ''
  })

  const setAuth = (bool: boolean) => isAuth.value = bool

  const setUser = (userInfo: IUser) => {
    Object.assign(user.value, userInfo)
    localStorage.setItem('user', JSON.stringify(userInfo))
  }

  const fetchAllUsers = async () => {
    try {
      const response = await UserService.fetchUsers()
      usersData.value = response.data
    } catch (e) {
      if (isAxiosError(e)) {
        console.log(e.response?.data?.message)
      } else {
        console.log(e)
      }
    }
  }

  const login = async () => {
    try {
      const response = await AuthService.login(formLogin)
      localStorage.setItem('token', response.data.accessToken)
      setAuth(true)
      setUser(response.data.user_info)
    } catch (e) {
      if (isAxiosError(e)) {
        console.log(e.response?.data?.message)
      } else {
        console.log(e)
      }
    }
  }

  const registration = async () => {
    try {
      const response = await AuthService.registration(formRegistration)
      localStorage.setItem('token', response.data.accessToken)
      setAuth(true)
      setUser(response.data.user_info)
    } catch (e) {
      if (isAxiosError(e)) {
        console.log(e.response?.data?.message)
      } else {
        console.log(e)
      }
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()
    } catch (e) {
      if (isAxiosError(e)) {
        console.log(e.response?.data?.message)
      } else {
        console.log(e)
      }
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setAuth(false)
      setUser({})
    }
  }

  // Викликає /user/refresh — тільки для випадку, коли токен реально протух
  const checkAuth = async () => {
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/user/refresh`, { withCredentials: true })
      localStorage.setItem('token', response.data.accessToken)
      setAuth(true)
      setUser(response.data.user_info)
    } catch (e) {
      setAuth(false)
      if (isAxiosError(e)) {
        console.log(e.response?.data?.message)
      } else {
        console.log(e)
      }
    } finally {
      authChecked.value = true
    }
  }

  // Викликається один раз при завантаженні застосунку / оновленні сторінки
  const restoreSession = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      setAuth(false)
      authChecked.value = true
      return
    }

    if (isTokenExpired(token)) {
      // токен протух — тільки в цьому випадку йдемо за новим
      await checkAuth()
      return
    }

    // токен ще валідний — відновлюємо стан без запиту на бекенд
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.log('Не вдалося розпарсити збереженого юзера', e)
      }
    }
    setAuth(true)
    authChecked.value = true
  }

  return {
    isAuth,
    authChecked,
    user,
    formLogin,
    formRegistration,
    usersData,
    fetchAllUsers,
    login,
    registration,
    logout,
    checkAuth,
    restoreSession
  }
})
