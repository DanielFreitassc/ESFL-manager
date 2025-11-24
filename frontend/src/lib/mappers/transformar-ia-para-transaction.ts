import type { ParcelaIA } from "@/lib/api-ia"
import type { Transaction } from "@/lib/api"

export function transformarIaParaTransaction(s: ParcelaIA): Transaction {
  return {
    id: "", // deixamos vazio para novos lançamentos
    costCenter: null,
    expenseCategory: s.expenseCategory,
    expenseCategoryPt: "",
    amount: s.amount,
    dueDate: s.dueDate,
    installmentNumber: s.installmentNumber,
    notes: s.notes,
    createdAt: "", // backend preencherá
    type: s.type,
    transactionStatus: s.transactionStatus,
    supplier: null,
  }
}
