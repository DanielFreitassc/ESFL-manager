"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  Plus,
  Trash,
  Pencil
} from "lucide-react"
import Link from "next/link"
import { NovoLancamentoModal } from "@/components/novo-lancamento-modal"
import { NovoFornecedorModal } from "./novo-fornecedor-modal"
import { api, ResponsePadrao } from "@/lib/api"

interface Fornecedor {
  id: string
  name: string
  cnpj: string
  corporateName: string
}

interface TransactionStat {
  type: string
  totalAmount: number
}

export function DashboardView() {
  const [isModalNovoLancamentoOpen, setIsModalNovoLancamentoOpen] =
    useState(false)
  const [isModalNovoFornecedorOpen, setIsModalNovoFornecedorOpen] =
    useState(false)
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [fornecedorSelecionado, setFornecedorSelecionado] =
    useState<Fornecedor | undefined>(undefined)

  const [stats, setStats] = useState<
    { title: string; value: string; subtitle: string }[]
  >([])

  // Buscar fornecedores
  async function fetchFornecedores() {
    try {
      const { data } =
        await api.get<ResponsePadrao<Fornecedor[]>>("/suppliers")
      setFornecedores(data?.content || [])
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error)
    }
  }

  // Buscar estatísticas (transactions)
  async function fetchStats() {
    try {
      const [incomeRes, expenseRes, realAmountRes] = await Promise.all([
        api.get<TransactionStat>("/transactions/income"),
        api.get<TransactionStat>("/transactions/expense"),
        api.get<TransactionStat>("/transactions/real-amount")
      ])

      const formatCurrency = (value: number) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL"
        }).format(value)

      setStats([
        {
          title: "Receita",
          value: formatCurrency(incomeRes.data.totalAmount),
          subtitle: "Recursos recebidos este mês"
        },
        {
          title: "Despesas",
          value: formatCurrency(expenseRes.data.totalAmount),
          subtitle: "Gastos realizados este mês"
        },
        {
          title: "Saldo Real",
          value: formatCurrency(realAmountRes.data.totalAmount),
          subtitle: "Disponível atualmente"
        }
      ])
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error)
    }
  }

  // Deletar fornecedor
  async function handleDeleteFornecedor(id: string) {
    try {
      await api.delete(`/suppliers/${id}`)
      setFornecedores((prev) => prev.filter((f) => f.id !== id))
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error)
    }
  }

  // Editar fornecedor
  function handleEditFornecedor(fornecedor: Fornecedor) {
    setFornecedorSelecionado(fornecedor)
    setIsModalNovoFornecedorOpen(true)
  }

  useEffect(() => {
    fetchFornecedores()
    fetchStats()
  }, [])

  const categories = [
    {
      name: "Pessoal",
      description: "Salários, encargos e benefícios",
      used: 128340,
    },
    {
      name: "Serviço",
      description: "Terceirizados, consultorias, manutenção",
      used: 89500,
    },
    {
      name: "Consumo",
      description: "Material escolar, energia, água",
      used: 42180,
    }
  ]

  const recentTransactions = [
    {
      date: "14/04/2024",
      type: "despesa",
      category: "Pessoal",
      description: "Folha de pagamento - Abril",
      value: -32500,
      status: "Realizado"
    },
    {
      date: "13/04/2024",
      type: "despesa",
      category: "Merenda",
      description: "Compra de alimentos para merenda escolar",
      value: -8750,
      status: "Realizado"
    },
    {
      date: "12/04/2024",
      type: "receita",
      category: "Capital",
      description: "Repasse governamental - Parcela 4",
      value: 37500,
      status: "Realizado"
    },
    {
      date: "11/04/2024",
      type: "despesa",
      category: "Consumo",
      description: "Material escolar e suprimentos",
      value: -3240,
      status: "Provisionado"
    },
    {
      date: "10/04/2024",
      type: "despesa",
      category: "Serviço",
      description: "Serviços de limpeza e higienização",
      value: -2800,
      status: "Realizado"
    }
  ]

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)

  return (
    <div className="space-y-6">
      {/* Estatísticas Dinâmicas (Transactions) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.subtitle}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gastos por Categoria */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Gastos por Categoria
          </h2>
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
                <CardDescription className="mt-2">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold">
                      {formatCurrency(category.used)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Parcela Card */}
          {/* <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Vencimento da Parcela
              </CardTitle>
              <CardDescription className="text-orange-900">
                <span className="text-2xl font-bold">
                  {parcela.daysRemaining}
                </span>{" "}
                dias restantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Período utilizado
                  </span>
                  <span className="font-medium">
                    {parcela.daysUsed} de {parcela.daysTotal} dias
                  </span>
                </div>
                <Progress
                  value={(parcela.daysUsed / parcela.daysTotal) * 100}
                  className="h-2"
                />
              </div>
              <p className="text-sm text-orange-900">
                Cuidado com o prazo de utilização da parcela.
              </p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Centro de Custo:</span>{" "}
                  {parcela.centroCusto}
                </p>
                <p>
                  <span className="font-medium">Parcela:</span>{" "}
                  {parcela.parcela}
                </p>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>

      {/* Lançamentos Recentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lançamentos Recentes</CardTitle>
              <CardDescription>
                Mostrando os 5 lançamentos mais recentes. Parcela atual: 4
                (Abril)
              </CardDescription>
            </div>
            <Button onClick={() => setIsModalNovoLancamentoOpen(true)}>
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
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Data
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Tipo
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Categoria
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Descrição
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                    Valor
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 text-sm">{transaction.date}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          transaction.type === "receita"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm">
                      {transaction.category}
                    </td>
                    <td className="py-3 text-sm">
                      {transaction.description}
                    </td>
                    <td
                      className={`py-3 text-right text-sm font-medium ${
                        transaction.value > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(Math.abs(transaction.value))}
                    </td>
                    <td className="py-3 text-right">
                      <Badge
                        variant={
                          transaction.status === "Realizado"
                            ? "default"
                            : "outline"
                        }
                      >
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

      {/* Fornecedores */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Fornecedores</CardTitle>
            <Button
              onClick={() => {
                setFornecedorSelecionado(undefined)
                setIsModalNovoFornecedorOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Fornecedor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Nome
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    CNPJ
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Razão Social
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {fornecedores.map((f) => (
                  <tr key={f.id} className="border-b last:border-0">
                    <td className="py-3 text-sm">{f.name}</td>
                    <td className="py-3 text-sm">{f.cnpj}</td>
                    <td className="py-3 text-sm">{f.corporateName}</td>
                    <td className="py-3 text-right flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditFornecedor(f)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteFornecedor(f.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modais */}
      <NovoFornecedorModal
        open={isModalNovoFornecedorOpen}
        onOpenChange={(open) => {
          setIsModalNovoFornecedorOpen(open)
          if (!open) {
            fetchFornecedores()
            setFornecedorSelecionado(undefined)
          }
        }}
        fornecedor={fornecedorSelecionado}
      />

      <NovoLancamentoModal
        open={isModalNovoLancamentoOpen}
        onOpenChange={setIsModalNovoLancamentoOpen}
      />
    </div>
  )
}
