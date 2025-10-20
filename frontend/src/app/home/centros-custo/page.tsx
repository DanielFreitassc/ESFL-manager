"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { NovoCentroCustoModal } from "@/components/novo-centro-custo-modal"
import { EditarCentroCustoModal } from "@/components/editar-centro-custo-modal"
import { VisualizarCentroCustoModal } from "@/components/visualizar-centro-custo-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getCostCenters, deleteCostCenter, type CostCenter, type PaginatedResponse } from "@/lib/api"
import { toast } from "react-toastify"

export default function CentrosCustoPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null)
  const [centrosCusto, setCentrosCusto] = useState<CostCenter[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const pageSize = 10

  const fetchCostCenters = async (page = 0) => {
    try {
      setLoading(true)
      const data: PaginatedResponse<CostCenter> = await getCostCenters(page, pageSize)
      setCentrosCusto(data.content)
      setCurrentPage(data.number)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao carregar centros de custo")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCostCenters()
  }, [])

  const handleSuccess = () => {
    fetchCostCenters(currentPage)
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      fetchCostCenters(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchCostCenters(currentPage + 1)
    }
  }

  const handleView = (centro: CostCenter) => {
    setSelectedCostCenter(centro)
    setViewModalOpen(true)
  }

  const handleEdit = (centro: CostCenter) => {
    setSelectedCostCenter(centro)
    setEditModalOpen(true)
  }

  const handleDeleteClick = (centro: CostCenter) => {
    setSelectedCostCenter(centro)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedCostCenter?.id) return

    try {
      await deleteCostCenter(selectedCostCenter.id)
      toast.success("Centro de custo deletado com sucesso!")
      setDeleteDialogOpen(false)
      setSelectedCostCenter(null)
      fetchCostCenters(currentPage)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao deletar centro de custo")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando centros de custo...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/home">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Centros de Custo - AFASC</h1>
            <p className="text-muted-foreground">Visão Geral dos Centros de Custo</p>
          </div>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Centro de Custo
        </Button>
      </div>

      {centrosCusto.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Nenhum centro de custo cadastrado</p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Centro de Custo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {centrosCusto.map((centro) => (
              <Card key={centro.id || centro.name} className="overflow-hidden">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-2xl">{centro.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">Tipo: {centro.type}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Centro de custo cadastrado no sistema</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(centro)} className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(centro)} className="flex-1">
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(centro)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {centrosCusto.length} de {totalElements} centros de custo
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1 || loading}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <NovoCentroCustoModal open={modalOpen} onOpenChange={setModalOpen} onSuccess={handleSuccess} />
      <EditarCentroCustoModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={handleSuccess}
        costCenter={selectedCostCenter}
      />
      <VisualizarCentroCustoModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        costCenter={selectedCostCenter}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o centro de custo "{selectedCostCenter?.name}"? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
