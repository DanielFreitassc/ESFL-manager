"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import { api } from "@/lib/api"

interface Fornecedor {
  id: string
  name: string
  cnpj: string
  corporateName: string
}

interface NovoFornecedorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fornecedor?: Fornecedor // se presente, estamos editando
}

export function NovoFornecedorModal({
  open,
  onOpenChange,
  fornecedor
}: NovoFornecedorModalProps) {
  const [name, setName] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [corporateName, setCorporateName] = useState("")
  const [loading, setLoading] = useState(false)

  // Preenche os campos quando modal é aberto e tem fornecedor
  useEffect(() => {
    if (open && fornecedor) {
      setName(fornecedor.name)
      setCnpj(fornecedor.cnpj)
      setCorporateName(fornecedor.corporateName)
    } else if (open && !fornecedor) {
      // Se for novo, limpa os campos
      setName("")
      setCnpj("")
      setCorporateName("")
    }
  }, [open, fornecedor])

  async function salvarFornecedor() {
    setLoading(true)
    try {
      if (fornecedor) {
        // Editar (PUT)
        await api.put(`/supplier/${fornecedor.id}`, {
          name,
          cnpj,
          corporateName
        })
      } else {
        // Criar (POST)
        await api.post("/supplier", {
          name,
          cnpj,
          corporateName
        })
      }

      // Limpar e fechar modal
      setName("")
      setCnpj("")
      setCorporateName("")
      onOpenChange(false)

      // Aqui você pode emitir evento ou toast
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            {fornecedor ? "Editar fornecedor" : "Cadastrar novo fornecedor"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4 flex flex-col">
            <label className="text-xs font-medium text-muted-foreground mb-1">
              Nome *
            </label>
            <Input
              type="text"
              className="h-9 text-sm w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col">
            <label className="text-xs font-medium text-muted-foreground mb-1">
              CNPJ *
            </label>
            <Input
              type="text"
              className="h-9 text-sm w-full"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col">
            <label className="text-xs font-medium text-muted-foreground mb-1">
              Razão Social *
            </label>
            <Input
              type="text"
              className="h-9 text-sm w-full"
              value={corporateName}
              onChange={(e) => setCorporateName(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 text-sm"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={salvarFornecedor}
            className="h-9 px-4 text-sm bg-slate-900 hover:bg-slate-800 text-white"
            disabled={loading || !name || !cnpj || !corporateName}
          >
            {loading
              ? fornecedor
                ? "Salvando edição..."
                : "Salvando..."
              : fornecedor
              ? "Salvar Edição"
              : "Salvar Lançamento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
