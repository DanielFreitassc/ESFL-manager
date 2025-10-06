"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DashboardView } from "@/components/dashboard-view"
import { PlanosTrabalhoView } from "@/components/planos-trabalho-view"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { BarChart3, FolderKanban, Link, LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [activeView, setActiveView] = useState<"dashboard" | "planos">("dashboard")

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">AFASC - Sistema Financeiro</h1>
              <p className="text-sm text-muted-foreground">Gestão de recursos - Entidade sem fins lucrativos</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-9 flex items-center justify-center gap-2 rounded-full border bg-muted">
                <Button
                  variant={activeView === "dashboard" ? "default" : "ghost"}
                  onClick={() => setActiveView("dashboard")}
                  className={`flex items-center gap-2 rounded-full px-4 ${activeView === "dashboard" ? "shadow-sm" : ""}`}
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>

                <Button
                  variant={activeView === "planos" ? "default" : "ghost"}
                  onClick={() => setActiveView("planos")}
                  className={`flex items-center gap-2 rounded-full px-4 ${activeView === "planos" ? "shadow-sm" : ""}`}
                >
                  <FolderKanban className="h-4 w-4" />
                  Planos de Trabalho
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Gerenciamento</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/pending">Usuários Pendentes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/active">Usuários Ativos</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      {activeView === "dashboard" ? <DashboardView /> : <PlanosTrabalhoView />}

    </div>
  )
}
