"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, UserCheck, LogOut, Menu, X } from "lucide-react"
import { removeToken } from "@/lib/auth"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    removeToken()
    router.push("/")
  }

  const menuItems = [
    {
      title: "Usuários Pendentes",
      href: "/dashboard/pending",
      icon: Users,
    },
    {
      title: "Usuários Ativos",
      href: "/dashboard/active",
      icon: UserCheck,
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 border-r border-border bg-sidebar md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <h1 className="text-lg font-semibold text-sidebar-foreground">Gerenciamento</h1>
        </div>
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
        <div className="border-t border-sidebar-border p-4">
          <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <h1 className="text-lg font-semibold">Gerenciamento</h1>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)] px-4 py-4">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
          <div className="border-t border-border p-4">
            <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex-1 md:flex-none">
            <h2 className="text-lg font-semibold md:text-xl">Sistema de Usuários</h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-muted/40 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
