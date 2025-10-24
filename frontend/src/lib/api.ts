import axios from "axios"
import Cookies from "js-cookie"

const API_BASE_URL = "http://localhost:8080"

export type ResponsePadrao<T> = {
  content?: T,
  message?: string,
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export interface TransactionCategoryStat {
  type: string
  amount: number
  notes: string
}

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export interface User {
  id: string
  name: string
  email: string
  active?: boolean
  createdAt?: string
  role?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user?: User
  message?: string
}

export interface ApiError {
  message: string
}

// Transactions API
export async function getTransactionsByCategory() {
  try {
    const endpoints = [
      { key: "personnel", name: "Pessoal" },
      { key: "service", name: "Serviço" },
      { key: "consumption", name: "Consumo" },
      { key: "food", name: "Alimentação" },
      { key: "operationg", name: "Operacional" },
    ]

    const responses = await Promise.all(
      endpoints.map((e) => api.get<TransactionCategoryStat>(`/transactions/${e.key}`))
    )

    return responses.map((res, i) => ({
      name: endpoints[i].name,
      description: res.data.notes,
      used: res.data.amount,
    }))
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao buscar gastos por categoria")
  }
}

// Auth API
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/auth/login", payload)
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao fazer login")
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/users", payload)
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao registrar usuário")
  }
}

// Users API
export async function getPendingUsers(page = 0, size = 20): Promise<PaginatedResponse<User>> {
  try {
    const { data } = await api.get<PaginatedResponse<User>>("/users/pending", {
      params: {
        page,
        size,
      },
    })
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao buscar usuários pendentes")
  }
}

export async function getActiveUsers(page = 0, size = 20): Promise<PaginatedResponse<User>> {
  try {
    const { data } = await api.get<PaginatedResponse<User>>("/users", {
      params: {
        page,
        size,
      },
    })
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao buscar usuários ativos")
  }
}

export interface PaginatedResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    offset: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalPages: number
  totalElements: number
  first: boolean
  size: number
  number: number
  numberOfElements: number
  empty: boolean
}

export async function activateUser(id: string): Promise<void> {
  try {
    await api.post(`/users/${id}/activate`)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao ativar/desativar usuário")
  }
}

export async function updateUser(id: string, payload: Partial<RegisterPayload>): Promise<User> {
  try {
    const { data } = await api.patch<User>(`/users/${id}`, payload)
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao atualizar usuário")
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await api.delete(`/users/${id}`)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao deletar usuário")
  }
}

// Cost Center API
export interface CostCenter {
  id?: string
  name: string
  type: string
  select?: string // Technical value used for API updates
}

export async function getCostCenters(page = 0, size = 10): Promise<PaginatedResponse<CostCenter>> {
  try {
    const { data } = await api.get<PaginatedResponse<CostCenter>>("/costs", {
      params: {
        page,
        size,
      },
    })
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao buscar centros de custo")
  }
}

export async function createCostCenter(payload: CostCenter): Promise<CostCenter> {
  try {
    const { data } = await api.post<CostCenter>("/costs", payload)
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao criar centro de custo")
  }
}

export async function getCostCenter(id: string): Promise<CostCenter> {
  try {
    const { data } = await api.get<CostCenter>(`/costs/${id}`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao buscar centro de custo")
  }
}

export async function updateCostCenter(id: string, payload: { name: string; type: string }): Promise<CostCenter> {
  try {
    const { data } = await api.put<CostCenter>(`/costs/${id}`, payload)
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao atualizar centro de custo")
  }
}

export async function deleteCostCenter(id: string): Promise<void> {
  try {
    await api.delete(`/costs/${id}`)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao deletar centro de custo")
  }
}
