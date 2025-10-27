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
import { DollarSign, Plus, Trash, Pencil } from "lucide-react"
import Link from "next/link"
import { NovoLancamentoModal } from "@/components/novo-lancamento-modal"
import { NovoFornecedorModal } from "./novo-fornecedor-modal"
import { api, ResponsePadrao, Transaction } from "@/lib/api"
import { getTransactionsByCategory } from "@/lib/api"

interface Fornecedor {
  id: string
  name: string
  cnpj: string
  corporateName: string
}

export function DashboardView() {
  const [isModalNovoLancamentoOpen, setIsModalNovoLancamentoOpen] = useState(false)
  const [isModalNovoFornecedorOpen, setIsModalNovoFornecedorOpen] = useState(false)
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedor | undefined>(undefined)

  const [transactionSelecionada, setTransactionSelecionada] = useState<Transaction | undefined>(undefined)

  const [stats, setStats] = useState<{ title: string; value: string; subtitle: string }[]>([])
  const [categories, setCategories] = useState<{ name: string; description: string; used: number }[]>([])

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // 🔹 Buscar categorias dinamicamente
  async function fetchCategories() {
    try {
      const data = await getTransactionsByCategory()
      setCategories(data)
    } catch (error) {
      console.error("Erro ao buscar categorias:", error)
    }
  }

  // Buscar fornecedores
  async function fetchFornecedores() {
    try {
      const { data } = await api.get<ResponsePadrao<Fornecedor[]>>("/suppliers")
      setFornecedores(data?.content || [])
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error)
    }
  }

  // Buscar estatísticas (transactions)
  async function fetchStats() {
    try {
      const [incomeRes, expenseRes, realAmountRes] = await Promise.all([
        api.get<{ totalAmount: number }>("/transactions/income"),
        api.get<{ totalAmount: number }>("/transactions/expense"),
        api.get<{ totalAmount: number }>("/transactions/real-amount")
      ])

      const formatCurrency = (value: number) =>
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

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

  // Buscar lançamentos paginados
  async function fetchTransactions(pageNumber = 0, size = 10) {
    try {
      const res = await api.get(`/transactions?page=${pageNumber}&size=${size}`)
      setTransactions(res.data.content)
      setPage(res.data.pageable.pageNumber)
      setTotalPages(res.data.totalPages)
    } catch (error) {
      console.error("Erro ao buscar lançamentos:", error)
    }
  }

  function handleEditTransaction(transaction: Transaction) {
    setTransactionSelecionada(transaction)
    setIsModalNovoLancamentoOpen(true)
  }

  // Deletar lançamento
  async function handleDeleteTransaction(id: string) {
    try {
      await api.delete(`/transactions/${id}`)
      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      console.error("Erro ao deletar lançamento:", error)
    }
  }

  // Deletar fornecedor
  async function handleDeleteFornecedor(id: string) {
    try {
      await api.delete(`/suppliers/${id}`)
      setFornecedores(prev => prev.filter(f => f.id !== id))
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
    fetchCategories()
    fetchTransactions()
  }, [])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  return (
    <div className="space-y-6">
      {/* Estatísticas Dinâmicas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{stat.value}</div>
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
          {categories.map(category => (
            <Card key={category.name}>
              <CardHeader>
                <CardDescription className="mt-2">{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{formatCurrency(category.used)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Lançamentos Recentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lançamentos Recentes</CardTitle>
              <CardDescription>Mostrando a página {page + 1} de {totalPages}</CardDescription>
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
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Data</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Categoria</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Descrição</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Valor</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id} className="border-b last:border-0">
                    <td className="py-3 text-sm">{transaction.dueDate}</td>
                    <td className="py-3">
                      <Badge variant={transaction.type === "INCOME" ? "default" : "secondary"}>
                        {transaction.type === "INCOME" ? "receita" : "despesa"}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm">{transaction.expenseCategoryPt || transaction.expenseCategory}</td>
                    <td className="py-3 text-sm">{transaction.notes}</td>
                    <td className={`py-3 text-right text-sm font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(Math.abs(transaction.amount))}
                    </td>
                    <td className="py-3 text-right">
                      <Badge variant={transaction.transactionStatus === "efetuado" ? "default" : "outline"}>
                        {transaction.transactionStatus === "efetuado" ? "Realizado" : "Provisionado"}
                      </Badge>
                    </td>
                    <td className="py-3 text-right flex justify-end gap-2">
                      {/* <Button variant="outline" size="icon" onClick={() => handleEditTransaction(transaction)}>
                        <Pencil className="h-4 w-4" />
                      </Button> */}
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteTransaction(transaction.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="mt-4 flex justify-between">
            <Button
              disabled={page === 0}
              onClick={() => fetchTransactions(page - 1)}
            >
              Anterior
            </Button>
            <Button
              disabled={page + 1 >= totalPages}
              onClick={() => fetchTransactions(page + 1)}
            >
              Próxima
            </Button>
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
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Nome</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">CNPJ</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Razão Social</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {fornecedores.map(f => (
                  <tr key={f.id} className="border-b last:border-0">
                    <td className="py-3 text-sm">{f.name}</td>
                    <td className="py-3 text-sm">{f.cnpj}</td>
                    <td className="py-3 text-sm">{f.corporateName}</td>
                    <td className="py-3 text-right flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditFornecedor(f)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteFornecedor(f.id)}>
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
        transaction={transactionSelecionada}
        onOpenChange={setIsModalNovoLancamentoOpen}
        onLancamentoCriado={() => {
          fetchStats()
          fetchCategories()
          fetchTransactions()
        }}
      />

    </div>
  )
}
