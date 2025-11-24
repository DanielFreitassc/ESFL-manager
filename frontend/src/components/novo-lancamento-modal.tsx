"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FilePenLine, Bot, WandSparkles, Lightbulb, FileText } from "lucide-react"
import { NovoLancamentoFormModal } from "./novo-lancamento-form-modal"
import { NovoLancamentoPorIaFormModal } from "./novo-lancamento-por-ia-form-modal"
import { Transaction, ParcelResponse } from "@/lib/api"
import { api } from "@/lib/api" // Para buscar as parcelas

interface NovoLancamentoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLancamentoCriado?: () => void
  transaction?: Transaction
}

export function NovoLancamentoModal({
  open,
  onOpenChange,
  onLancamentoCriado,
  transaction,
}: NovoLancamentoModalProps) {
  const [openForm, setOpenForm] = useState(false)
  const [openIA, setOpenIA] = useState(false)
  const [openParcelSelect, setOpenParcelSelect] = useState(false)
  const [selectedParcel, setSelectedParcel] = useState<ParcelResponse | null>(null)
  const [parcelList, setParcelList] = useState<ParcelResponse[]>([])
  const [transactionList, setTransactionList] = useState<Transaction[]>([])

  const fetchLancamentos = async () => {
    try {
      const response = await api.get("/transactions") // ou sua rota real
      setTransactionList(response.data) // supondo que você tenha um estado para a lista
    } catch (error) {
      console.error("Erro ao buscar lançamentos", error)
    }
  }

  // 🔹 Lógica de abrir modal correto
  useEffect(() => {
    if (open) {
      if (transaction) {
        setOpenForm(true)
      } else {
        setOpenForm(false)
        setOpenIA(false)
      }
    } else {
      setOpenForm(false)
      setOpenIA(false)
      setOpenParcelSelect(false)
      setSelectedParcel(null)
    }
  }, [open, transaction])

  // Buscar parcelas disponíveis
  useEffect(() => {
    if (!open) return
    async function fetchParcels() {
      try {
        const response = await api.get<{ content: ParcelResponse[] }>("/parcels")
        setParcelList(response.data.content)
      } catch (error) {
        console.error("Erro ao buscar parcelas:", error)
      }
    }
    fetchParcels()
  }, [open])
  
  const handleSelectManual = () => setOpenForm(true)
  
  const handleSelectIA = () => {
    setOpenParcelSelect(true) // Abre modal de seleção de parcelas
  }

  const handleParcelChosen = (parcel: ParcelResponse) => {
    setSelectedParcel(parcel)
    setOpenParcelSelect(false)
    setOpenIA(true) // Abre modal IA com parcelId definido
  }

  const showEscolhaModal = open && !transaction && !openForm && !openIA && !openParcelSelect

  return (
    <>
      {/* Modal de escolha */}
      <Dialog open={showEscolhaModal} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[850px] p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              <WandSparkles className="h-6 w-6 text-primary" />
              Como você gostaria de fazer o lançamento?
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Card Manual */}
            <Card
              className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
              onClick={handleSelectManual}
            >
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                  <FilePenLine className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Lançamento Manual</h3>
                <p className="mb-8 text-sm text-muted-foreground">
                  Preencha todos os campos manualmente com controle total sobre cada informação do lançamento.
                </p>
                <Button variant="outline" className="mt-auto h-11 w-full text-base">
                  <FileText className="mr-2 h-4 w-4" />
                  Escolher Manual
                </Button>
              </CardContent>
            </Card>

            {/* Card IA */}
            <Card
              className="cursor-pointer border-2 border-violet-400 transition-all hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-1"
              onClick={handleSelectIA}
            >
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-xl font-semibold text-transparent">
                    Lançamento com IA
                  </h3>
                  <Badge className="border-violet-500 bg-violet-100 text-violet-700 hover:bg-violet-200">
                    NOVO
                  </Badge>
                </div>
                <p className="mb-8 text-sm text-muted-foreground">
                  Nossa IA analisa a parcela selecionada e sugere lançamentos inteligentes baseados no histórico.
                </p>
                <Button className="mt-auto h-11 w-full bg-gradient-to-r from-purple-500 to-violet-600 text-base text-white hover:opacity-90">
                  <WandSparkles className="mr-2 h-4 w-4" />
                  Usar IA
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Dica */}
          <div className="mt-8 flex items-start gap-4 rounded-lg bg-blue-50 p-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
              <Lightbulb className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Dica</h4>
              <p className="text-sm text-slate-600">
                A IA considera parcelas anteriores com saldo disponível e sugere gastos otimizados para cada centro de custo.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de formulário manual */}
      <NovoLancamentoFormModal
        open={openForm}
        onOpenChange={(open) => {
          setOpenForm(open)
          if (!open) onOpenChange(false)
        }}
        transaction={openForm && transaction ? transaction : undefined}
        onLancamentoCriado={onLancamentoCriado} // dispara refetch no pai
      />



      {/* Modal de seleção de parcelas */}
      <Dialog open={openParcelSelect} onOpenChange={setOpenParcelSelect}>
        <DialogContent className="sm:max-w-[600px] p-6">
          <DialogHeader>
            <DialogTitle>Selecione a Parcela para IA</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4 max-h-64 overflow-y-auto">
            {parcelList.map((p) => (
              <Button
                key={p.id}
                onClick={() => handleParcelChosen(p)}
                className="justify-start"
              >
                {p.destination} - R$ {p.amount.toLocaleString("pt-BR")} - Vence {p.available}
              </Button>
            ))}
            {parcelList.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma parcela disponível
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal IA */}
      {selectedParcel && (
       <NovoLancamentoPorIaFormModal
         open={openIA}
        onOpenChange={setOpenIA}
        parcelId={selectedParcel.id}
        onLancamentoCriado={onLancamentoCriado} // função que recarrega a lista
      />
      )}
    </>
  )
}
