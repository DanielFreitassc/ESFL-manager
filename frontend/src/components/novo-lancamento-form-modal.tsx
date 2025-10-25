"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "react-toastify"
import { format } from "date-fns"
import { SugestaoIA } from "./novo-lancamento-por-ia-form-modal"

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
  onLancamentoCriado?: () => void
}

export function NovoLancamentoFormModal({ open, onOpenChange, sugestao  }: NovoLancamentoFormModalProps) {
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

  useEffect(() => {
  if (sugestao) {
    setAmount(sugestao.valorSugerido)
    setNotes(sugestao.justificativa)
    setCategory(sugestao.categoria.toLowerCase() as CategoryKey)
    setType("despesa") // ou 'receita', dependendo da lógica
    setDate(format(new Date(), "yyyy-MM-dd"))
  }
}, [sugestao])

  // Buscar fornecedores e centros de custo
  useEffect(() => {
  if (!open) return
    async function fetchData() {
        try {
          const [suppliers, costs] = await Promise.all([
            api.get<Supplier[]>("/suppliers/list"),
            api.get<CostCenter[]>("/costs/list")
          ])
          setSupplierList(suppliers.data)
          setCostCenters(costs.data)
        } catch {
          toast.error("Erro ao carregar fornecedores ou centros de custo")
        }
      }
      fetchData()
    }, [open]) 


  const handleSubmit = async () => {
    if (!date || !amount || !supplierId || !costCenterId) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    const formattedDate = format(new Date(date), "dd/MM/yyyy")

    const payload = {
      type: typeMap[type],
      transactionStatus: statusMap[status],
      expenseCategory: categoryMap[category],
      amount,
      dueDate: formattedDate,
      notes,
      supplierId,
      costCenterId,
      installmentNumber: 1
    }

    try {
      await api.post("/transactions", payload)
      toast.success("Lançamento criado com sucesso!")
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao criar lançamento")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>Novo Lançamento</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4 flex flex-col">
            <label>Data *</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="col-span-12 md:col-span-4 flex flex-col">
            <label>Tipo *</label>
            <Select value={type} onValueChange={(v) => setType(v as TypeKey)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="receita">Receita</SelectItem>
                <SelectItem value="despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-12 md:col-span-4 flex flex-col">
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
                <SelectItem key={key} value={key}>{key}</SelectItem>
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
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
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
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Salvar Lançamento</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
