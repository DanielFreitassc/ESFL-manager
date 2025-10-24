"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { WandSparkles } from "lucide-react"
import { NovoLancamentoFormModal } from "./novo-lancamento-form-modal"

export interface SugestaoIA {
    id: number
    prioridade: "Alta" | "Média" | "Baixa"
    tags: string[]
    titulo: string
    categoria: string
    justificativa: string
    valorSugerido: number
    valorDisponivel: number
    utilizacao: number // percentual 0-100
}

// Modal de Sugestões da IA
interface ModalIAProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function NovoLancamentoPorIaFormModal({ open, onOpenChange }: ModalIAProps) {
    const [sugestoes, setSugestoes] = useState<SugestaoIA[]>([])
    const [selectedSugestao, setSelectedSugestao] = useState<SugestaoIA | null>(null)
    const [abrirModalLancamento, setAbrirModalLancamento] = useState(false)

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                setSugestoes([
                    {
                        id: 1,
                        prioridade: "Alta",
                        tags: ["Marketing", "Campanha"],
                        titulo: "Ajuste de campanha de anúncios",
                        categoria: "Marketing",
                        justificativa: "O saldo disponível permite aumentar o alcance da campanha sem ultrapassar o orçamento mensal.",
                        valorSugerido: 1500,
                        valorDisponivel: 2000,
                        utilizacao: 75
                    },
                    {
                        id: 2,
                        prioridade: "Média",
                        tags: ["TI", "Infraestrutura"],
                        titulo: "Upgrade de servidores",
                        categoria: "TI",
                        justificativa: "A atualização vai melhorar o desempenho dos sistemas críticos, aproveitando saldo disponível.",
                        valorSugerido: 800,
                        valorDisponivel: 1200,
                        utilizacao: 66.7
                    },
                    {
                        id: 3,
                        prioridade: "Baixa",
                        tags: ["RH", "Treinamento"],
                        titulo: "Treinamento de equipe",
                        categoria: "Recursos Humanos",
                        justificativa: "Investimento em capacitação, sem impactar fortemente o orçamento atual.",
                        valorSugerido: 300,
                        valorDisponivel: 1000,
                        utilizacao: 30
                    }
                ])
            }, 500)
        } else {
            setSugestoes([])
            setSelectedSugestao(null)
        }
    }, [open])

    return (
        <>
            {/* Modal de Sugestões IA */}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[850px] h-[70vh] rounded-2xl p-6 sm:p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                            <WandSparkles className="h-6 w-6 text-primary" />
                            Sugestões Inteligentes da IA
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Análise concluída: encontre oportunidades de otimização baseadas em saldos disponíveis
                        </p>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
                        {sugestoes.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                Nenhuma sugestão disponível no momento.
                            </p>
                        )}

                        {sugestoes.map((s) => (
                            <Card
                                key={s.id}
                                className={`border hover:shadow-lg transition-all cursor-pointer ${selectedSugestao?.id === s.id ? "border-violet-500 shadow-xl" : ""}`}
                                onClick={() => setSelectedSugestao(s)}
                            >
                                <CardContent className="flex flex-col gap-2 p-4">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge variant="destructive" className="border-red-400 bg-red-100 text-red-700">
                                            Prioridade {s.prioridade}
                                        </Badge>
                                        {s.tags.map((tag) => (
                                            <Badge key={tag} className="border bg-gray-100 text-gray-700">{tag}</Badge>
                                        ))}
                                    </div>

                                    <h3 className="text-lg font-semibold">{s.titulo}</h3>
                                    <p className="text-sm text-muted-foreground">Categoria: {s.categoria}</p>
                                    <p className="text-sm bg-gray-100 p-2 rounded">{s.justificativa}</p>

                                    <div className="flex items-center justify-between gap-2 mt-2">
                                        <Progress value={s.utilizacao} className="flex-1 h-2 rounded-full" />
                                        <span className="text-sm font-medium">{s.utilizacao.toFixed(1)}%</span>
                                    </div>

                                    <p className="text-right text-purple-700 font-semibold text-lg mt-1">
                                        R$ {s.valorSugerido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                        <span className="text-sm text-muted-foreground"> de R$ {s.valorDisponivel.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} disponível</span>
                                    </p>

                                    {selectedSugestao?.id === s.id && (
                                        <div className="mt-4 flex gap-2">
                                            <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                                                Executar Sugestão
                                            </Button>
                                            <Button
                                                className="flex-1 border"
                                                onClick={() => {
                                                    setAbrirModalLancamento(true)
                                                }}
                                            >
                                                Ajustar Sugestão
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

            {/* Modal de Novo Lançamento preenchido */}
            <NovoLancamentoFormModal
                open={abrirModalLancamento}
                onOpenChange={setAbrirModalLancamento}
                //sugestao={selectedSugestao}
            />
        </>
    )
}