"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { CostCenter } from "@/lib/api"

interface VisualizarCentroCustoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  costCenter: CostCenter | null
}

const COST_TYPES_MAP: Record<string, string> = {
  OPERATING: "Operacional",
  OPERATING_CAPITAL: "Operacional e Capital",
  OPERATING_CAPITAL_FOOD: "Operacional, Capital e Alimentação",
  PERSONNEL_CONSUMPTION_SERVICE_CAPITAL: "Pessoal, Consumo, Serviço e Capital",
}

export function VisualizarCentroCustoModal({ open, onOpenChange, costCenter }: VisualizarCentroCustoModalProps) {
  if (!costCenter) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Centro de Custo</DialogTitle>
          <DialogDescription>Informações completas do centro de custo</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">ID</Label>
            <p className="text-sm font-mono bg-muted p-2 rounded">{costCenter.id}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Nome</Label>
            <p className="text-base font-medium">{costCenter.name}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Tipo</Label>
            <p className="text-base">{costCenter.type}</p>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => onOpenChange(false)}>Fechar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
