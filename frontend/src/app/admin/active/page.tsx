"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getActiveUsers, activateUser, deleteUser, type User, type PaginatedResponse } from "@/lib/api"
import { getToken } from "@/lib/auth"
import { Loader2, Users, Trash2, Edit, UserX, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EditUserDialog } from "@/components/edit-user-dialog"
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

export default function ActiveUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const pageSize = 20

  const loadUsers = async (page = 0) => {
    setIsLoading(true)

    try {
      const token = getToken()
      if (!token) {
        toast.error("Token não encontrado")
        return
      }

      const data: PaginatedResponse<User> = await getActiveUsers(token, page, pageSize)
      setUsers(data.content)
      setCurrentPage(data.number)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao carregar usuários")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleDeactivate = async (id: string) => {
    setDeactivatingId(id)

    try {
      const token = getToken()
      if (!token) {
        toast.error("Token não encontrado")
        return
      }

      await activateUser(id, token)
      toast.success("Usuário desativado com sucesso!")
      await loadUsers(currentPage)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao desativar usuário")
    } finally {
      setDeactivatingId(null)
    }
  }

  const handleDelete = async () => {
    if (!userToDelete) return

    setDeletingId(userToDelete.id)

    try {
      const token = getToken()
      if (!token) {
        toast.error("Token não encontrado")
        return
      }

      await deleteUser(userToDelete.id, token)
      toast.success("Usuário deletado com sucesso!")
      setUserToDelete(null)
      await loadUsers(currentPage)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao deletar usuário")
    } finally {
      setDeletingId(null)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      loadUsers(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      loadUsers(currentPage + 1)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Usuários Ativos</h1>
        <p className="text-muted-foreground">Gerencie usuários aprovados do sistema</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">Nenhum usuário ativo no momento</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                          Ativo
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">{user.email}</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingUser(user)}
                        className="flex-1 sm:flex-none"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeactivate(user.id)}
                        disabled={deactivatingId === user.id}
                        className="flex-1 sm:flex-none"
                      >
                        {deactivatingId === user.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Desativando...
                          </>
                        ) : (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Desativar
                          </>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setUserToDelete(user)}
                        disabled={deletingId === user.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {users.length} de {totalElements} usuários
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0 || isLoading}
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
                  disabled={currentPage >= totalPages - 1 || isLoading}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => loadUsers(currentPage)}
        />
      )}

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o usuário <strong>{userToDelete?.name}</strong>? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {deletingId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deletando...
                </>
              ) : (
                "Deletar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
