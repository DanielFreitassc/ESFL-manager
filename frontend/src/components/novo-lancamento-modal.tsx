"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FilePenLine, Bot, WandSparkles, Lightbulb, FileText } from "lucide-react"

interface NovoLancamentoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NovoLancamentoModal({ open, onOpenChange }: NovoLancamentoModalProps) {
  const [selectedOption, setSelectedOption] = useState<"manual" | "ia" | null>(null)

  const handleSelectManual = () => {
    setSelectedOption("manual")
    onOpenChange(false)
  }

  const handleSelectIA = () => {
    setSelectedOption("ia")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <WandSparkles className="h-6 w-6 text-primary" />
            Como você gostaria de fazer o lançamento?
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card Manual (sem alterações) */}
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
              <ul className="mb-8 w-full space-y-3 text-left text-sm text-slate-700">
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Controle total dos dados
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Ideal para lançamentos específicos
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Processo tradicional
                </li>
              </ul>
              <Button variant="outline" className="mt-auto h-11 w-full text-base">
                <FileText className="mr-2 h-4 w-4" />
                Escolher Manual
              </Button>
            </CardContent>
          </Card>

          {/* Card IA (com degradê roxo) */}
          <Card
            className="cursor-pointer border-2 border-violet-400 transition-all hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-1" // -> Borda mais vibrante
            onClick={handleSelectIA}
          >
            <CardContent className="flex flex-col items-center p-8 text-center">
              {/* // -> DEGRADE APLICADO no fundo do ícone */}
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg">
                <Bot className="h-10 w-10 text-white" /> {/* // -> Ícone branco para contraste */}
              </div>

              <div className="mb-2 flex items-center gap-2">
                {/* // -> DEGRADE APLICADO no texto do título */}
                <h3 className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-xl font-semibold text-transparent">
                  Lançamento com IA
                </h3>
                <Badge className="border-violet-500 bg-violet-100 text-violet-700 hover:bg-violet-200">NOVO</Badge>
              </div>
              <p className="mb-8 text-sm text-muted-foreground">
                Nossa IA analisa seus saldos e sugere lançamentos inteligentes baseados no histórico.
              </p>
              <ul className="mb-8 w-full space-y-3 text-left text-sm text-slate-700">
                <li className="flex items-center gap-3">
                  {/* // -> DEGRADE APLICADO no marcador */}
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-500" />
                  Sugestões automáticas
                </li>
                <li className="flex items-center gap-3">
                  {/* // -> DEGRADE APLICADO no marcador */}
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-500" />
                  Análise de saldos disponíveis
                </li>
                <li className="flex items-center gap-3">
                   {/* // -> DEGRADE APLICADO no marcador */}
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-500" />
                  Otimização de recursos
                </li>
              </ul>
              <Button className="mt-auto h-11 w-full bg-gradient-to-r from-purple-500 to-violet-600 text-base text-white hover:opacity-90">
                <WandSparkles className="mr-2 h-4 w-4" />
                Usar IA
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Dica */}
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
  )
}