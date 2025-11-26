import axios from "axios";

const IA_BASE_URL = process.env.NEXT_PUBLIC_IA_URL ?? "http://localhost:5000";

export const apiIA = axios.create({
  baseURL: IA_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 445000, // tempo máximo
});

export interface ParcelaIA {
  expenseCategory: string;
  notes: string;
  dueDate: string;
  installmentNumber: number;
  amount: number;
  type: string;
  transactionStatus: string;
}

export async function gerarRespostaIA(parcelId: string): Promise<ParcelaIA[]> {
  try {
    const { data } = await apiIA.get(`/parcels/${parcelId}/planning`);
    return data;
  } catch (e) {
    console.error("Erro IA:", e);
    throw new Error("Erro ao consultar IA");
  }
}
