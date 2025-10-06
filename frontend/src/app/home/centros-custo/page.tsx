"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  BookMarked,
  Building,
  Users,
  Sun,
  HandCoins,
  Shield,
  HeartHandshake,
  Baby,
} from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"

// Dados expandidos com ícones e slugs para as rotas
const centrosCusto = [
  {
    nome: "Educação",
    slug: "educacao",
    valorAnual: 450000,
    utilizado: 285300,
    icon: <BookMarked className="h-8 w-8 text-sky-500" />,
  },
  {
    nome: "Fundeb",
    slug: "fundeb",
    valorAnual: 380000,
    utilizado: 259540,
    icon: <HandCoins className="h-8 w-8 text-amber-500" />,
  },
  {
    nome: "SCFV 18-59",
    slug: "scfv-18-59",
    valorAnual: 280000,
    utilizado: 65240,
    icon: <Users className="h-8 w-8 text-teal-500" />,
  },
  {
    nome: "SCFV 0-17",
    slug: "scfv-0-17",
    valorAnual: 320000,
    utilizado: 103040,
    icon: <Baby className="h-8 w-8 text-cyan-500" />,
  },
  {
    nome: "SCFV Pessoa Idosa",
    slug: "scfv-pessoa-idosa",
    valorAnual: 200000,
    utilizado: 179600,
    icon: <HeartHandshake className="h-8 w-8 text-rose-500" />,
  },
  {
    nome: "Abrigo Florescer I",
    slug: "abrigo-florescer-i",
    valorAnual: 180000,
    utilizado: 46260,
    icon: <Shield className="h-8 w-8 text-indigo-500" />,
  },
  {
    nome: "Abrigo Florescer II",
    slug: "abrigo-florescer-ii",
    valorAnual: 180000,
    utilizado: 145800,
    icon: <Shield className="h-8 w-8 text-indigo-500" />,
  },
  {
    nome: "Abrigo Lar Azul",
    slug: "abrigo-lar-azul",
    valorAnual: 150000,
    utilizado: 115950,
    icon: <Shield className="h-8 w-8 text-blue-500" />,
  },
  {
    nome: "Praça Céu",
    slug: "praca-ceu",
    valorAnual: 120000,
    utilizado: 66960,
    icon: <Sun className="h-8 w-8 text-yellow-500" />,
  },
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

export default function CentrosCustoPage() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/home">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Centros de Custo - AFASC</h1>
          <p className="text-muted-foreground">Visão Geral dos Centros de Custo</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {centrosCusto.map((centro) => {
          const percentual = (centro.utilizado / centro.valorAnual) * 100
          const disponivel = centro.valorAnual - centro.utilizado

          return (
            <Link href={`/centros-de-custo/${centro.slug}`} key={centro.nome}>
              <Card className="flex h-full flex-col transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg font-medium">{centro.nome}</CardTitle>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/40">
                    {centro.icon}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-grow flex-col">
                  <p className="text-xs text-muted-foreground">Orçamento Anual</p>
                  <p className="mb-4 text-2xl font-bold">{formatCurrency(centro.valorAnual)}</p>

                  <div className="mb-1 flex justify-between text-sm">
                    <span>Utilizado</span>
                    <span className="font-semibold">{percentual.toFixed(1)}%</span>
                  </div>
                  <Progress value={percentual} className="h-2" />
                  <p className="mt-1 text-right text-xs text-muted-foreground">
                    {formatCurrency(centro.utilizado)}
                  </p>

                  <div className="mt-auto rounded-lg bg-green-50 p-3 pt-6 dark:bg-green-950/20">
                    <p className="text-sm text-green-700 dark:text-green-300">Disponível</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(disponivel)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}