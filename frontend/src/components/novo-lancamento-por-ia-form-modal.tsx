"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WandSparkles } from "lucide-react"
import { toast } from "react-toastify"
import { NovoLancamentoFormModal } from "./novo-lancamento-form-modal"
import { transformarIaParaTransaction } from "@/lib/mappers/transformar-ia-para-transaction"
import { apiIA } from "@/lib/api-ia"

export interface SugestaoIA {
  valorSugerido: number
  justificativa: string
  categoria: string
  // outros campos que você usa
}

export interface ParcelaIA {
  id: string
  expenseCategory: string
  notes: string
  amount: number
  dueDate: string
  installmentNumber: number
  type: "INCOME" | "EXPENSE"
  transactionStatus: "PROJECTION" | "COMPLETED"
}

// Props do modal
interface ModalIAProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parcelId: string
  onLancamentoCriado?: () => void // callback para disparar refetch no pai
}

// Função que chama a API real da IA usando Axios
async function gerarRespostaIA(parcelId: string): Promise<ParcelaIA[]> {
  try {
    const { data } = await apiIA.get<ParcelaIA[]>(`/parcels/${parcelId}/planning`)
    return data
  } catch (error: any) {
    console.error("Erro ao buscar sugestões da IA:", error)
    return []
  }
}

export function NovoLancamentoPorIaFormModal({
  open,
  onOpenChange,
  parcelId,
  onLancamentoCriado,
}: ModalIAProps) {
  const [sugestoes, setSugestoes] = useState<ParcelaIA[]>([])
  const [selectedSugestao, setSelectedSugestao] = useState<ParcelaIA | null>(null)
  const [abrirModalLancamento, setAbrirModalLancamento] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadIA() {
      if (!open) {
        setSugestoes([])
        setSelectedSugestao(null)
        return
      }

      setLoading(true)
      try {
        const resposta = await gerarRespostaIA(parcelId)
        setSugestoes(resposta)
      } catch (e) {
        console.error("Erro ao buscar IA:", e)
        toast.error("Não foi possível obter sugestões da IA no momento.")
        setSugestoes([])
      }
      setLoading(false)
    }

    loadIA()
  }, [open, parcelId])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[850px] h-[70vh] rounded-2xl p-6 sm:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              <WandSparkles className="h-6 w-6 text-primary" />
              Sugestões Inteligentes da IA
            </DialogTitle>
          </DialogHeader>

          {loading && (
            <p className="text-center text-sm text-muted-foreground py-4">
              A IA está analisando suas parcelas… ⏳
            </p>
          )}

          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
            {!loading && sugestoes.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma sugestão disponível no momento.
              </p>
            )}

            {sugestoes.map((s, i) => (
              <Card
                key={i}
                className={`border hover:shadow-lg transition-all cursor-pointer ${
                  selectedSugestao === s ? "border-violet-500 shadow-xl" : ""
                }`}
                onClick={() => setSelectedSugestao(s)}
              >
                <CardContent className="flex flex-col gap-2 p-4">
                  <Badge className="bg-violet-100 text-violet-700 border-violet-300">
                    {s.expenseCategory}
                  </Badge>

                  <h3 className="text-lg font-semibold">{s.notes}</h3>
                  <p className="text-sm text-muted-foreground">Vencimento: {s.dueDate}</p>
                  <p className="text-sm">Parcela nº {s.installmentNumber}</p>
                  <p className="text-purple-700 font-semibold text-lg">
                    R$ {s.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>

                  {selectedSugestao === s && (
                    <div className="mt-4 flex gap-2">
                      <Button
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => setAbrirModalLancamento(true)}
                      >
                        Executar Sugestão
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={() => onOpenChange(false)} className="h-11 px-6">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal do lançamento preenchido pela IA */}
      <NovoLancamentoFormModal
        open={abrirModalLancamento}
        onOpenChange={setAbrirModalLancamento}
        transaction={selectedSugestao ? transformarIaParaTransaction(selectedSugestao) : undefined}
        onLancamentoCriado={() => {
          onOpenChange(false)           // fecha modal IA
          onLancamentoCriado?.()        // dispara callback do pai
        }}
      />
    </>
  )
}
