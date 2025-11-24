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

export interface PlanoTrabalhoPayload {
  destination: string 
  amount: number
  available: string 
}

export interface ParcelResponse {
id: string
destination: string
amount: number
available: string
createdAt: string
}

export interface TransactionCategoryStat {
  type: string
  amount: number
  notes: string
}

export interface Supplier {
  id: string
  name: string
  cnpj?: string
  corporateName?: string
}

export interface TransactionPayload {
  type: "INCOME" | "EXPENSE"
  installmentNumber: number
  costCenterId: string
  expenseCategory: "PERSONNEL" | "SERVICE" | "CONSUMPTION" | "CAPITAL" | "FOOD" | "OPERATING"
  supplierId?: string
  notes?: string
  amount: number
  dueDate: string // formato "dd/MM/yyyy"
  transactionStatus: "PROJECTION" | "COMPLETED"
}

// Cost Center API
export interface CostCenter {
  id?: string
  name: string
  type: string
  select?: string // Technical value used for API updates
}


export interface Transaction {
  id: string
  type: "INCOME" | "EXPENSE" | string           // IA usa string → permite
  installmentNumber: number

  costCenter: CostCenter | null                  // IA não envia costCenter → aceita null

  expenseCategory: string
  expenseCategoryPt: string

  supplier?: Supplier | null                     // IA não envia supplier → aceita null

  notes?: string
  amount: number
  dueDate: string
  createdAt: string

  transactionStatus:
    | "efetuado"
    | "projecao"
    | "COMPLETED"
    | "PROJECTION"
    | string                                     // IA envia string → permite
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

export async function createPlanoTrabalhoParcela(payload: PlanoTrabalhoPayload): Promise<{ message: string }> {
  try {
    const { data } = await api.post<{ message: string }>("/parcels", payload)
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao criar Plano de Trabalho (Parcela)")
  }
}

export async function getParcels(): Promise<{ content: ParcelResponse[] }> {
  try {
  const { data } = await api.get("/parcels")
  return data
  } catch (error: any) {
  if (error.response?.data?.message) throw new Error(error.response.data.message)
  throw new Error("Erro ao carregar parcelas")
  }
}


export async function getParcel(id: string): Promise<ParcelResponse> {
  try {
  const { data } = await api.get(`/parcels/${id}`)
  return data
  } catch (error: any) {
  if (error.response?.data?.message) throw new Error(error.response.data.message)
  throw new Error("Erro ao buscar parcela")
  }
}


export async function updateParcel(id: string, payload: { destination: string; amount: number; available: string }): Promise<void> {
  try {
  await api.put(`/parcels/${id}`, payload)
  } catch (error: any) {
  if (error.response?.data?.message) throw new Error(error.response.data.message)
  throw new Error("Erro ao atualizar parcela")
  }
}

export async function deleteParcel(id: string): Promise<void> {
  try {
  await api.delete(`/parcels/${id}`)
  } catch (error: any) {
  if (error.response?.data?.message) throw new Error(error.response.data.message)
  throw new Error("Erro ao excluir parcela")
  }
}

export async function updateTransaction(id: string, payload: TransactionPayload): Promise<void> {
  try {
    await api.put(`/transactions/${id}`, payload)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao atualizar lançamento")
  }
}

export async function createTransaction(payload: TransactionPayload): Promise<void> {
  try {
    await api.post("/transactions", payload)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao criar lançamento")
  }
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


export async function getSuppliers(): Promise<Supplier[]> {
  try {
    const { data } = await api.get<Supplier[]>("/suppliers/list")
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao buscar fornecedores")
  }
}

export async function getCostCentersList(): Promise<CostCenter[]> {
  try {
    const { data } = await api.get<CostCenter[]>("/costs/list")
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao buscar centros de custo")
  }
}

export async function getTransactions(page = 0, size = 10): Promise<PaginatedResponse<Transaction>> {
  try {
    const { data } = await api.get<PaginatedResponse<Transaction>>(`/transactions?page=${page}&size=${size}`)

    const mappedContent: Transaction[] = data.content.map(t => ({
      ...t,
      // Mapear status em português para inglês
      transactionStatus: (
        t.transactionStatus === "efetuado"
          ? "COMPLETED"
          : t.transactionStatus === "projecao"
          ? "PROJECTION"
          : t.transactionStatus
      ) as "efetuado" | "projecao" | "COMPLETED" | "PROJECTION",

      // Garantir que expenseCategoryPt esteja definido
      expenseCategoryPt: (t as any).expenseCategoryPt || t.expenseCategory
    }))

    return {
      ...data,
      content: mappedContent
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Erro ao buscar transações")
  }
}


