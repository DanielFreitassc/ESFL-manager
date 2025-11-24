import axios from "axios";

export const apiIA = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 445000, // 5 segundos
})


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
