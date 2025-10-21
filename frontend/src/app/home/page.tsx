"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DashboardView } from "@/components/dashboard-view"
import { PlanosTrabalhoView } from "@/components/planos-trabalho-view"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import { BarChart3, FolderKanban, LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

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
                  <Button variant="outline" size="icon" aria-label="Configurações">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 p-2 flex flex-col"
                >
                  <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Gerenciamento
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

                  <Link href="/admin/pending" passHref legacyBehavior>
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer rounded-md px-3 py-2 text-sm text-gray-700
                      hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                    >
                      <a>Usuários Pendentes</a>
                    </DropdownMenuItem>
                  </Link>

                  <Link href="/admin/active" passHref legacyBehavior>
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer rounded-md px-3 py-2 text-sm text-gray-700
                      hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                    >
                      <a>Usuários Ativos</a>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="icon" onClick={handleLogout} aria-label="Sair">
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
