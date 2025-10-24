"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createCostCenter } from "@/lib/api"
import { toast } from "react-toastify"

interface NovoCentroCustoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const COST_TYPES = [
  { value: "OPERATING", label: "Operacional" },
  { value: "OPERATING_CAPITAL", label: "Operacional e Capital" },
  { value: "OPERATING_CAPITAL_FOOD", label: "Operacional, Capital e Alimentação" },
  { value: "PERSONNEL_CONSUMPTION_SERVICE_CAPITAL", label: "Pessoal, Consumo, Serviço e Capital" },
]

export function NovoCentroCustoModal({ open, onOpenChange, onSuccess }: NovoCentroCustoModalProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !type) {
      toast.error("Preencha todos os campos")
      return
    }

    setLoading(true)
    try {
      await createCostCenter({ name, type })
      toast.success("Centro de custo criado com sucesso!")
      setName("")
      setType("")
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar centro de custo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Centro de Custo</DialogTitle>
          <DialogDescription>Cadastre um novo centro de custo para a AFASC</DialogDescription>
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
            <Select value={type} onValueChange={setType} disabled={loading}>
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
              {loading ? "Criando..." : "Criar Centro de Custo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
