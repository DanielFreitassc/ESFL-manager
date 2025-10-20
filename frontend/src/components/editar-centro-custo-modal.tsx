"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateCostCenter, type CostCenter } from "@/lib/api"
import { toast } from "react-toastify"

interface EditarCentroCustoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  costCenter: CostCenter | null
}

const COST_TYPES = [
  { value: "OPERATING", label: "Operacional" },
  { value: "OPERATING_CAPITAL", label: "Operacional e Capital" },
  { value: "OPERATING_CAPITAL_FOOD", label: "Operacional, Capital e Alimentação" },
  { value: "PERSONNEL_CONSUMPTION_SERVICE_CAPITAL", label: "Pessoal, Consumo, Serviço e Capital" },
]

export function EditarCentroCustoModal({ open, onOpenChange, onSuccess, costCenter }: EditarCentroCustoModalProps) {
  const [name, setName] = useState("")
  const [select, setSelect] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (costCenter) {
      setName(costCenter.name)
      setSelect(costCenter.select || costCenter.type)
    }
  }, [costCenter])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !select || !costCenter?.id) {
      toast.error("Preencha todos os campos")
      return
    }

    setLoading(true)
    try {
      await updateCostCenter(costCenter.id, { name, type: select })
      toast.success("Centro de custo atualizado com sucesso!")
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar centro de custo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Centro de Custo</DialogTitle>
          <DialogDescription>Atualize as informações do centro de custo</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Centro de Custo</Label>
            <Input
              id="name"
              placeholder="Ex: Compra de alimentos para merenda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={select} onValueChange={setSelect} disabled={loading}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {COST_TYPES.map((costType) => (
                  <SelectItem key={costType.value} value={costType.value}>
                    {costType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
