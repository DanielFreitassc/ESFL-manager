"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateUser, type User } from "@/lib/api"
import { getToken } from "@/lib/auth"
import { Loader2, AlertCircle } from "lucide-react"

interface EditUserDialogProps {
  user: User
  onClose: () => void
  onSuccess: () => void
}

export function EditUserDialog({ user, onClose, onSuccess }: EditUserDialogProps) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password && password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres")
      return
    }

    setIsLoading(true)

    try {
      const token = getToken()
      if (!token) {
        setError("Token não encontrado")
        return
      }

      const payload: { name?: string; email?: string; password?: string } = {}

      if (name !== user.name) payload.name = name
      if (email !== user.email) payload.email = email
      if (password) payload.password = password

      await updateUser(user.id, payload, token)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar usuário")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário. Deixe campos em branco para não alterar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Nova Senha</Label>
              <Input
                id="edit-password"
                type="password"
                placeholder="Deixe em branco para não alterar"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">
                Deixe em branco se não quiser alterar a senha. Mínimo 6 caracteres.
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
