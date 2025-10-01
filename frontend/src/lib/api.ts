import axios from "axios"

const API_BASE_URL = "http://localhost:8080"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

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
export async function getPendingUsers(token: string, page = 0, size = 20): Promise<PaginatedResponse<User>> {
  try {
    const { data } = await api.get<PaginatedResponse<User>>("/users/pending", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export async function getActiveUsers(token: string, page = 0, size = 20): Promise<PaginatedResponse<User>> {
  try {
    const { data } = await api.get<PaginatedResponse<User>>("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export async function activateUser(id: string, token: string): Promise<void> {
  try {
    await api.post(`/users/${id}/activate`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao ativar/desativar usuário")
  }
}

export async function updateUser(id: string, payload: Partial<RegisterPayload>, token: string): Promise<User> {
  try {
    const { data } = await api.patch<User>(`/users/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao atualizar usuário")
  }
}

export async function deleteUser(id: string, token: string): Promise<void> {
  try {
    await api.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao deletar usuário")
  }
}
