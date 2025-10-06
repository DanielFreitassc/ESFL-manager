"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Download, Trash2, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-toastify"

interface PlanoTrabalho {
  id: string
  nome: string
  centroCusto: string
  ano: string
  arquivo: string
  dataUpload: string
  tamanho: string
  status: "Aprovado" | "Pendente" | "Rejeitado"
}

export function PlanosTrabalhoView() {
  const [selectedCentroCusto, setSelectedCentroCusto] = useState("")
  const [selectedAno, setSelectedAno] = useState("")
  const [nomeArquivo, setNomeArquivo] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Mock data - substituir por dados reais da API
  const [planos] = useState<PlanoTrabalho[]>([
    {
      id: "1",
      nome: "Plano Anual Educação 2024",
      centroCusto: "Educação",
      ano: "2024",
      arquivo: "plano-educacao-2024.pdf",
      dataUpload: "15/03/2024",
      tamanho: "2.4 MB",
      status: "Aprovado",
    },
    {
      id: "2",
      nome: "Plano FUNDEB 2024",
      centroCusto: "Fundeb",
      ano: "2024",
      arquivo: "plano-fundeb-2024.pdf",
      dataUpload: "10/03/2024",
      tamanho: "1.8 MB",
      status: "Aprovado",
    },
    {
      id: "3",
      nome: "Plano SCFV 18-59 2024",
      centroCusto: "SCFV 18-59",
      ano: "2024",
      arquivo: "plano-scfv-2024.pdf",
      dataUpload: "05/03/2024",
      tamanho: "1.2 MB",
      status: "Pendente",
    },
  ])

  const centrosCusto = ["Educação", "Fundeb", "SCFV 18-59", "Merenda", "Capital"]
  const anos = ["2024", "2025", "2026"]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
      toast.success(`Arquivo ${e.dataTransfer.files[0].name} selecionado`)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      toast.success(`Arquivo ${e.target.files[0].name} selecionado`)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCentroCusto || !selectedAno || !nomeArquivo || !selectedFile) {
      toast.error("Preencha todos os campos e selecione um arquivo")
      return
    }
    toast.success("Plano de trabalho submetido com sucesso!")
    // Aqui você faria a chamada à API
  }

  const handleView = (plano: PlanoTrabalho) => {
    toast.info(`Visualizando ${plano.nome}`)
    // Implementar visualização do arquivo
  }

  const handleDownload = (plano: PlanoTrabalho) => {
    toast.success(`Baixando ${plano.arquivo}`)
    // Implementar download do arquivo
  }

  const handleDelete = (plano: PlanoTrabalho) => {
    toast.success(`${plano.nome} deletado`)
    // Implementar deleção
  }

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submeter Plano de Trabalho</CardTitle>
          <CardDescription>Gerenciamento de documentos por centro de custo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="centro-custo">Centro de Custo</Label>
                <Select value={selectedCentroCusto} onValueChange={setSelectedCentroCusto}>
                  <SelectTrigger id="centro-custo">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {centrosCusto.map((centro) => (
                      <SelectItem key={centro} value={centro}>
                        {centro}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ano">Ano</Label>
                <Select value={selectedAno} onValueChange={setSelectedAno}>
                  <SelectTrigger id="ano">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {anos.map((ano) => (
                      <SelectItem key={ano} value={ano}>
                        {ano}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome-arquivo">Nome do Arquivo</Label>
                <Input
                  id="nome-arquivo"
                  placeholder="Ex: Plano Anual 2024"
                  value={nomeArquivo}
                  onChange={(e) => setNomeArquivo(e.target.value)}
                />
              </div>
            </div>

            {/* Drag and Drop Area */}
            <div
              className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-2 text-sm font-medium">
                {selectedFile ? selectedFile.name : "Arraste e solte o arquivo aqui"}
              </p>
              <p className="mb-4 text-xs text-muted-foreground">ou</p>
              <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                Selecionar Arquivo
              </Button>
            </div>

            <Button type="submit" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Submeter Plano de Trabalho
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Planos Submetidos */}
      <Card>
        <CardHeader>
          <CardTitle>Planos Submetidos</CardTitle>
          <CardDescription>Histórico de documentos enviados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Nome</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Centro de Custo</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Ano</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Arquivo</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Data Upload</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Tamanho</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {planos.map((plano) => (
                  <tr key={plano.id} className="border-b last:border-0">
                    <td className="py-3 text-sm font-medium">{plano.nome}</td>
                    <td className="py-3 text-sm">{plano.centroCusto}</td>
                    <td className="py-3 text-sm">{plano.ano}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {plano.arquivo}
                      </div>
                    </td>
                    <td className="py-3 text-sm">{plano.dataUpload}</td>
                    <td className="py-3 text-sm">{plano.tamanho}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          plano.status === "Aprovado"
                            ? "default"
                            : plano.status === "Pendente"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {plano.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleView(plano)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(plano)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(plano)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
