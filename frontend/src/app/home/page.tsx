"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DashboardView } from "@/components/dashboard-view"
import { PlanosTrabalhoView } from "@/components/planos-trabalho-view"

export default function HomePage() {
  const [activeView, setActiveView] = useState<"dashboard" | "planos">("dashboard")

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-center gap-2 rounded-lg border bg-card p-1">
        <Button
          variant={activeView === "dashboard" ? "default" : "ghost"}
          onClick={() => setActiveView("dashboard")}
          className="flex-1"
        >
          Dashboard
        </Button>
        <Button
          variant={activeView === "planos" ? "default" : "ghost"}
          onClick={() => setActiveView("planos")}
          className="flex-1"
        >
          Planos de Trabalho
        </Button>
      </div>

      {/* Content */}
      {activeView === "dashboard" ? <DashboardView /> : <PlanosTrabalhoView />}
    </div>
  )
}
