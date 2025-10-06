"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, AlertCircle, Lightbulb, Plus } from "lucide-react"
import Link from "next/link"
import { NovoLancamentoModal } from "@/components/novo-lancamento-modal"

export function DashboardView() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock data - substituir por dados reais da API
  const stats = [
    {
      title: "Receita",
      value: "R$ 450.000,00",
      change: "+12,5%",
      description: "vs mês anterior",
      subtitle: "Recursos recebidos este mês",
      trend: "up" as const,
    },
    {
      title: "Despesas",
      value: "R$ 285.340,00",
      change: "+8,2%",
      description: "vs mês anterior",
      subtitle: "Gastos realizados este mês",
      trend: "up" as const,
    },
    {
      title: "Saldo Real",
      value: "R$ 164.660,00",
      change: "+15,3%",
      description: "vs mês anterior",
      subtitle: "Disponível atualmente",
      trend: "up" as const,
    },
    {
      title: "Saldo Projetado",
      value: "R$ 198.250,00",
      change: "+22,1%",
      description: "vs mês anterior",
      subtitle: "Projeção para próximo mês",
      trend: "up" as const,
    },
  ]

  const categories = [
    {
      name: "Pessoal",
      status: "Alto uso",
      description: "Salários, encargos e benefícios",
      used: 128340,
      total: 135000,
      percentage: 95.1,
    },
    {
      name: "Serviço",
      status: "Alto uso",
      description: "Terceirizados, consultorias, manutenção",
      used: 89500,
      total: 95000,
      percentage: 94.2,
    },
    {
      name: "Consumo",
      status: "Normal",
      description: "Material escolar, energia, água",
      used: 42180,
      total: 55000,
      percentage: 76.7,
    },
  ]

  const parcela = {
    daysRemaining: 45,
    daysTotal: 90,
    daysUsed: 45,
    centroCusto: "Educação",
    parcela: "4/12 (Abril 2024)",
  }

  const moreCategories = [
    {
      name: "Merenda",
      description: "Alimentação escolar e lanches",
      used: 25320,
      total: 30000,
      percentage: 84.4,
    },
    {
      name: "Capital",
      description: "Equipamentos, móveis e infraestrutura",
      used: 18750,
      total: 25000,
      percentage: 75.0,
    },
  ]

  const suggestions = [
    {
      type: "Otimização",
      priority: "Alta",
      title: "Reduzir Despesas Fixas",
      description: "Renegociar contratos de energia e internet para economizar R$ 2.500/mês",
      value: "Economia: R$ 2.500",
      color: "text-blue-600",
    },
    {
      type: "Educação",
      priority: "Média",
      title: "Material Didático",
      description: "Investir em materiais educativos digitais para melhorar o ensino",
      value: "Investimento: R$ 8.000",
      color: "text-purple-600",
    },
    {
      type: "Reserva",
      priority: "Alta",
      title: "Fundo de Emergência",
      description: "Criar reserva de 3 meses para situações imprevistas",
      value: "Meta: R$ 85.000",
      color: "text-orange-600",
    },
  ]

  const recentTransactions = [
    {
      date: "14/04/2024",
      type: "despesa",
      category: "Pessoal",
      description: "Folha de pagamento - Abril",
      value: -32500,
      status: "Realizado",
    },
    {
      date: "13/04/2024",
      type: "despesa",
      category: "Merenda",
      description: "Compra de alimentos para merenda escolar",
      value: -8750,
      status: "Realizado",
    },
    {
      date: "12/04/2024",
      type: "receita",
      category: "Capital",
      description: "Repasse governamental - Parcela 4",
      value: 37500,
      status: "Realizado",
    },
    {
      date: "11/04/2024",
      type: "despesa",
      category: "Consumo",
      description: "Material escolar e suprimentos",
      value: -3240,
      status: "Provisionado",
    },
    {
      date: "10/04/2024",
      type: "despesa",
      category: "Serviço",
      description: "Serviços de limpeza e higienização",
      value: -2800,
      status: "Realizado",
    },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                  <span className="text-muted-foreground">{stat.description}</span>
                </div>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gastos por Categoria */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Gastos por Categoria</h2>
          <Button asChild>
            <Link href="/home/centros-custo">
              <DollarSign className="mr-2 h-4 w-4" />
              Ver Centros de Custo
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.name}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <Badge variant={category.status === "Alto uso" ? "destructive" : "secondary"} className="mt-1">
                      {category.status}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="mt-2">{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold">{formatCurrency(category.used)}</span>
                    <span className="text-sm text-muted-foreground">de {formatCurrency(category.total)}</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Utilizado {category.percentage.toFixed(1)}%</span>
                    <span className="font-medium text-green-600">
                      Disponível: {formatCurrency(category.total - category.used)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Parcela Card */}
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Vencimento da Parcela
              </CardTitle>
              <CardDescription className="text-orange-900">
                <span className="text-2xl font-bold">{parcela.daysRemaining}</span> dias restantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Período utilizado</span>
                  <span className="font-medium">
                    {parcela.daysUsed} de {parcela.daysTotal} dias
                  </span>
                </div>
                <Progress value={(parcela.daysUsed / parcela.daysTotal) * 100} className="h-2" />
              </div>
              <p className="text-sm text-orange-900">Cuidado com o prazo de utilização da parcela.</p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Centro de Custo:</span> {parcela.centroCusto}
                </p>
                <p>
                  <span className="font-medium">Parcela:</span> {parcela.parcela}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* More Categories */}
        <div className="grid gap-4 md:grid-cols-2">
          {moreCategories.map((category) => (
            <Card key={category.name}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold">{formatCurrency(category.used)}</span>
                    <span className="text-sm text-muted-foreground">de {formatCurrency(category.total)}</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Utilizado {category.percentage.toFixed(1)}%</span>
                    <span className="font-medium text-green-600">
                      Disponível: {formatCurrency(category.total - category.used)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sugestões de Gestão */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <CardTitle>Sugestões de Gestão</CardTitle>
          </div>
          <CardDescription>Sugestões baseadas no histórico de gastos e metas da AFASC</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex gap-4 rounded-lg border p-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={suggestion.color}>
                      {suggestion.type}
                    </Badge>
                    <Badge variant={suggestion.priority === "Alta" ? "destructive" : "secondary"}>
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <h4 className="font-semibold">{suggestion.title}</h4>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  <p className="text-sm font-medium">{suggestion.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lançamentos Recentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lançamentos Recentes</CardTitle>
              <CardDescription>Mostrando os 5 lançamentos mais recentes. Parcela atual: 4 (Abril)</CardDescription>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Lançamento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Data</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Categoria</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Descrição</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Valor</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 text-sm">{transaction.date}</td>
                    <td className="py-3">
                      <Badge variant={transaction.type === "receita" ? "default" : "secondary"}>
                        {transaction.type}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm">{transaction.category}</td>
                    <td className="py-3 text-sm">{transaction.description}</td>
                    <td
                      className={`py-3 text-right text-sm font-medium ${
                        transaction.value > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(Math.abs(transaction.value))}
                    </td>
                    <td className="py-3 text-right">
                      <Badge variant={transaction.status === "Realizado" ? "default" : "outline"}>
                        {transaction.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <NovoLancamentoModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
