"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getPendingUsers, activateUser, type User, type PaginatedResponse } from "@/lib/api"
import { getToken } from "@/lib/auth"
import { Loader2, UserCheck, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function PendingUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activatingId, setActivatingId] = useState<string | null>(null)
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

      const data: PaginatedResponse<User> = await getPendingUsers(token, page, pageSize)
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

  const handleActivate = async (id: string) => {
    setActivatingId(id)

    try {
      const token = getToken()
      if (!token) {
        toast.error("Token não encontrado")
        return
      }

      await activateUser(id, token)
      toast.success("Usuário aprovado com sucesso!")
      await loadUsers(currentPage)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao aprovar usuário")
    } finally {
      setActivatingId(null)
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
        <h1 className="text-3xl font-bold tracking-tight text-balance">Usuários Pendentes</h1>
        <p className="text-muted-foreground">Aprove novos usuários para dar acesso ao sistema</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserCheck className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">Nenhum usuário pendente no momento</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription className="text-sm">{user.email}</CardDescription>
                    </div>
                    <Badge variant="secondary">Pendente</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleActivate(user.id)}
                    disabled={activatingId === user.id}
                    className="w-full"
                    size="sm"
                  >
                    {activatingId === user.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Aprovando...
                      </>
                    ) : (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Aprovar
                      </>
                    )}
                  </Button>
                </CardContent>
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
    </div>
  )
}
