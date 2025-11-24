"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
// 🔹 CORREÇÃO: Importar as funções de 'create' e 'update'
import { api, createTransaction, updateTransaction } from "@/lib/api" 
import { toast } from "react-toastify"
import { format, parse } from "date-fns"
import { SugestaoIA } from "@/components/novo-lancamento-por-ia-form-modal"
// 🔹 CORREÇÃO: Importar o tipo 'TransactionPayload'
import type { Transaction, TransactionPayload } from "@/lib/api" 

// Mapas PT → EN
const typeMap = { receita: "INCOME", despesa: "EXPENSE" } as const
const statusMap = { pendente: "PROJECTION", pago: "COMPLETED" } as const
const categoryMap = {
  pessoal: "PERSONNEL",
  servico: "SERVICE",
  consumo: "CONSUMPTION",
  capital: "CAPITAL",
  merenda: "FOOD",
  custeio: "OPERATING",
} as const

type TypeKey = keyof typeof typeMap
type StatusKey = keyof typeof statusMap
type CategoryKey = keyof typeof categoryMap

interface Supplier {
  id: string
  name: string
}

interface CostCenter {
  id: string
  name: string
}

interface NovoLancamentoFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sugestao?: SugestaoIA | null
  transaction?: Transaction | null
  onLancamentoCriado?: () => void
}

export function NovoLancamentoFormModal({
  open,
  onOpenChange,
  transaction,
  sugestao,
  onLancamentoCriado,
}: NovoLancamentoFormModalProps) {
  const [date, setDate] = useState("")
  const [type, setType] = useState<TypeKey>("despesa")
  const [status, setStatus] = useState<StatusKey>("pendente")
  const [category, setCategory] = useState<CategoryKey>("merenda")
  const [supplierId, setSupplierId] = useState("")
  const [supplierList, setSupplierList] = useState<Supplier[]>([])
  const [costCenterId, setCostCenterId] = useState("")
  const [costCenters, setCostCenters] = useState<CostCenter[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  // Preencher campos ao abrir o modal
  useEffect(() => {
    if (transaction) {
      if (transaction.dueDate) {
        try {
          const parsedDate = parse(transaction.dueDate, "dd/MM/yyyy", new Date())
          setDate(format(parsedDate, "yyyy-MM-dd"))
        } catch (error) {
          console.error("Erro ao parsear data:", transaction.dueDate, error)
          setDate(format(new Date(), "yyyy-MM-dd"))
        }
      } else {
        setDate(format(new Date(), "yyyy-MM-dd"))
      }

      setType(transaction.type === "INCOME" ? "receita" : "despesa")
      setStatus(transaction.transactionStatus === "COMPLETED" ? "pago" : "pendente")
      setCategory((transaction.expenseCategoryPt?.toLowerCase() || "merenda") as CategoryKey)
      setSupplierId(transaction.supplier?.id || "")
      setCostCenterId(transaction.costCenter?.id || "")
      setAmount(transaction.amount)
      setNotes(transaction.notes || "")
    } else if (sugestao) {
      setAmount(sugestao.valorSugerido)
      setNotes(sugestao.justificativa)
      setCategory(sugestao.categoria.toLowerCase() as CategoryKey)
      setType("despesa")
      setDate(format(new Date(), "yyyy-MM-dd"))
    }
  }, [transaction, sugestao])

  // Resetar campos ao fechar
  useEffect(() => {
    if (!open) {
      setDate("")
      setType("despesa")
      setStatus("pendente")
      setCategory("merenda")
      setSupplierId("")
      setCostCenterId("")
      setAmount(0)
      setNotes("")
    }
  }, [open])

  // Buscar fornecedores e centros de custo
  useEffect(() => {
    if (!open) return
    async function fetchData() {
      try {
        const [suppliers, costs] = await Promise.all([
          api.get<Supplier[]>("/suppliers/list"),
          api.get<CostCenter[]>("/costs/list"),
        ])
        setSupplierList(suppliers.data)
        setCostCenters(costs.data)
      } catch {
        toast.error("Erro ao carregar fornecedores ou centros de custo")
      }
    }
    fetchData()
  }, [open])

  // Criar ou editar lançamento
  const handleSubmit = async () => {
    // Validação dos campos obrigatórios
    if (!date || !amount || !supplierId || !costCenterId) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    // Converter data do input para o formato do backend (dd/MM/yyyy)
    const dateInput = parse(date, "yyyy-MM-dd", new Date())
    const formattedDate = format(dateInput, "dd/MM/yyyy")

    // Montar payload para envio
    const payload: TransactionPayload = {
      type: typeMap[type], // receita ou despesa → INCOME/EXPENSE
      transactionStatus: statusMap[status], // pendente/pago → PROJECTION/COMPLETED
      expenseCategory: categoryMap[category], // categoria
      amount,
      dueDate: formattedDate,
      notes,
      supplierId,
      costCenterId,
      installmentNumber: 1,
    }

    setLoading(true)

    try {
      if (transaction && transaction.id) {
        // Se já existe, atualizar
        await updateTransaction(transaction.id, payload)
        toast.success("Lançamento atualizado com sucesso!")
      } else {
        // Novo lançamento
        await createTransaction(payload)
        toast.success("Lançamento criado com sucesso!")
      }

      // Fechar modal
      onOpenChange(false)

      // Callback opcional após criação/edição
      onLancamentoCriado?.()
    } catch (error: any) {
      // Mostrar erro da API ou genérico
      toast.error(error?.message || "Erro ao salvar lançamento")
    } finally {
      setLoading(false)
    }
  }




  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>{transaction ? "Editar Lançamento" : "Novo Lançamento"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6 flex flex-col">
              <label>Data *</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

              <div className="col-span-12 md:col-span-6 flex flex-col">
                <label>Status *</label>
                <Select value={status} onValueChange={(v) => setStatus(v as StatusKey)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
        </div>

        <div className="mt-3">
          <label>Categoria *</label>
          <Select value={category} onValueChange={(v) => setCategory(v as CategoryKey)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(categoryMap).map((key) => (
                <SelectItem key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-3">
          <label>Fornecedor *</label>
          <Select value={supplierId} onValueChange={setSupplierId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o fornecedor" />
            </SelectTrigger>
            <SelectContent>
              {supplierList.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-3">
          <label>Centro de Custo *</label>
          <Select value={costCenterId} onValueChange={setCostCenterId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o centro de custo" />
            </SelectTrigger>
            <SelectContent>
              {costCenters.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-3">
          <div className="col-span-12 md:col-span-6 flex flex-col">
            <label>Valor (R$) *</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </div>

          <div className="col-span-12 md:col-span-6 flex flex-col">
            <label>Notas</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Lançamento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}