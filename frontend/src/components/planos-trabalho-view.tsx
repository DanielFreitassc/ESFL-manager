"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { createPlanoTrabalhoParcela, getParcels, updateParcel, deleteParcel } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, PlusCircle } from "lucide-react"

interface Parcel {
  id: string
  destination: string
  amount: number
  available: string   // agora é uma data (yyyy-MM-dd)
  createdAt: string
}

const destinoLabels: Record<string, string> = {
  EDUCATION: "Educação",
  SHELTER: "Abrigos",
  CHILD: "Serviço de Convivência e Fortalecimento de Vínculos",
  MOTHERS: "Clube de mães",
  AGED: "Idoso",
}


const destinos = [
  { value: "EDUCATION", label: "Educação" },
  { value: "SHELTER", label: "Abrigos" },
  { value: "CHILD", label: "Serviço de Convivência e Fortalecimento de Vínculos" },
  { value: "MOTHERS", label: "Clube de mães" },
  { value: "AGED", label: "Idoso" },
]

export function PlanosTrabalhoView() {
  const [destination, setDestination] = useState("")
  const [amount, setAmount] = useState("")
  const [available, setAvailable] = useState("")
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  const loadParcels = async () => {
    try {
      const data = await getParcels()
      setParcels(data.content)
    } catch {
      toast.error("Erro ao carregar parcelas")
    }
  }

  useEffect(() => {
    loadParcels()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!destination || !amount || !available) {
      toast.error("Preencha todos os campos")
      return
    }

    try {
      if (editingId) {
        await updateParcel(editingId, {
          destination,
          amount: Number(amount),
          available, // já está no formato yyyy-MM-dd
        })
        toast.success("Parcela atualizada!")
      } else {
        await createPlanoTrabalhoParcela({
          destination,
          amount: Number(amount),
          available,
        })
        toast.success("Parcela cadastrada!")
      }

      setDestination("")
      setAmount("")
      setAvailable("")
      setEditingId(null)
      loadParcels()
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar parcela")
    }
  }

  const handleEdit = (parcel: Parcel) => {
    setEditingId(parcel.id)
    setDestination(parcel.destination)
    setAmount(String(parcel.amount))
    setAvailable(parcel.available) // mantemos o ISO yyyy-MM-dd
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteParcel(id)
      toast.success("Parcela removida!")
      loadParcels()
    } catch {
      toast.error("Erro ao excluir parcela")
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            {editingId ? "Editar Parcela" : "Cadastrar Parcela"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div>
              <Label>Destino</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {destinos.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Valor</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <Label>Disponível em</Label>
              <Input
                type="date"
                value={available}
                onChange={(e) => setAvailable(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button type="submit" className="w-full">
                {editingId ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

      {/* LISTA DE PARCELAS */}
      <Card>
        <CardHeader>
          <CardTitle>Parcelas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Destino</th>
                <th>Valor</th>
                <th>Disponível em</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{destinoLabels[p.destination]}</td>
                  <td>R$ {p.amount.toFixed(2)}</td>
                  <td>{new Date(p.available).toLocaleDateString()}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="flex gap-2 p-2">
                    <Button variant="ghost" onClick={() => handleEdit(p)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
