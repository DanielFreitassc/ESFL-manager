"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SugestaoIA } from "./novo-lancamento-por-ia-form-modal"

interface NovoLancamentoFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    sugestao?: SugestaoIA | null
}

export function NovoLancamentoFormModal({ open, onOpenChange, sugestao }: NovoLancamentoFormModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[850px] rounded-2xl p-6">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-lg font-semibold text-slate-800">
                        Novo Lançamento
                    </DialogTitle>
                </DialogHeader>

                {/* Primeira linha */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-4 flex flex-col">
                        <label className="text-xs font-medium text-muted-foreground mb-1">Data *</label>
                        <Input type="date" className="h-9 text-sm w-full" />
                    </div>

                    <div className="col-span-12 md:col-span-4 flex flex-col">
                        <label className="text-xs font-medium text-muted-foreground mb-1">Tipo *</label>
                        <Select>
                            <SelectTrigger className="h-9 text-sm w-full">
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="receita">Receita</SelectItem>
                                <SelectItem value="despesa">Despesa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="col-span-12 md:col-span-4 flex flex-col">
                        <label className="text-xs font-medium text-muted-foreground mb-1">Status *</label>
                        <Select>
                            <SelectTrigger className="h-9 text-sm w-full">
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pendente">Pendente</SelectItem>
                                <SelectItem value="pago">Pago</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Categoria */}
                <div className="mt-3">
                    <label className="text-xs font-medium text-muted-foreground mb-1">Categoria *</label>
                    <Select>
                        <SelectTrigger className="h-9 text-sm w-full">
                            <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={sugestao?.categoria || "alimentacao"}>{sugestao?.categoria || "Alimentação"}</SelectItem>
                            <SelectItem value="transporte">Transporte</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Valor */}
                <div className="grid grid-cols-12 gap-4 mt-3">
                    <div className="col-span-12 md:col-span-6 flex flex-col">
                        <label className="text-xs font-medium text-muted-foreground mb-1">Fornecedor</label>
                        <Input placeholder="Nome do fornecedor" className="h-9 text-sm w-full" />
                    </div>

                    <div className="col-span-12 md:col-span-6 flex flex-col">
                        <label className="text-xs font-medium text-muted-foreground mb-1">Valor (R$) *</label>
                        <Input type="number" placeholder="0,00" className="h-9 text-sm w-full" defaultValue={sugestao?.valorSugerido} />
                    </div>
                </div>

                {/* Descrição */}
                <div className="mt-3 flex flex-col">
                    <label className="text-xs font-medium text-muted-foreground mb-1">Descrição</label>
                    <Textarea
                        placeholder="Detalhes do lançamento..."
                        className="min-h-[70px] text-sm w-full"
                        defaultValue={sugestao?.justificativa}
                    />
                </div>

                {/* Botões */}
                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 px-4 text-sm"
                    >
                        Cancelar
                    </Button>
                    <Button className="h-9 px-4 text-sm bg-slate-900 hover:bg-slate-800 text-white">
                        Salvar Lançamento
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}