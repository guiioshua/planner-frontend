import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Vendor } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function Vendors() {
  const { vendors, budgetStats, totalBudget, setTotalBudget, addVendor, updateVendor, deleteVendor } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [form, setForm] = useState({ company: "", category: "", contact: "", phone: "", totalPrice: "", amountPaid: "", notes: "" });
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  function openCreate() {
    setEditing(null);
    setForm({ company: "", category: "", contact: "", phone: "", totalPrice: "", amountPaid: "", notes: "" });
    setDialogOpen(true);
  }

  function openEdit(v: Vendor) {
    setEditing(v);
    setForm({
      company: v.company, category: v.category, contact: v.contact, phone: v.phone,
      totalPrice: String(v.totalPrice), amountPaid: String(v.amountPaid), notes: v.notes,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.company.trim()) return;
    const data = {
      company: form.company, category: form.category, contact: form.contact, phone: form.phone,
      totalPrice: Number(form.totalPrice) || 0, amountPaid: Number(form.amountPaid) || 0, notes: form.notes,
    };
    if (editing) {
      updateVendor(editing.id, data);
      toast.success("Fornecedor atualizado");
    } else {
      addVendor(data);
      toast.success("Fornecedor adicionado");
    }
    setDialogOpen(false);
  }

  function openBudgetEdit() {
    setBudgetInput(String(totalBudget ?? 0));
    setBudgetDialogOpen(true);
  }

  function handleSaveBudget() {
    const value = Number(budgetInput.replace(",", "."));
    if (Number.isNaN(value) || value < 0) {
      toast.error("Informe um valor de orçamento válido.");
      return;
    }
    setTotalBudget(value);
    toast.success("Orçamento atualizado");
    setBudgetDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-serif">Fornecedores</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="border-foreground/20" onClick={openBudgetEdit}>
            <DollarSign className="h-4 w-4 mr-2" /> Editar Orçamento
          </Button>
          <Button variant="outline" className="border-foreground/20" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" /> Novo Fornecedor
          </Button>
        </div>
      </div>

      {/* Budget summary bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Orçado", value: fmt(budgetStats.totalBudget) },
          { label: "Total Pago", value: fmt(budgetStats.totalPaid), color: "text-success" },
          { label: "Restante", value: fmt(budgetStats.remaining), color: "text-warning" },
        ].map((s) => (
          <Card key={s.label} className="border border-border/50 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-sans font-normal uppercase tracking-wider text-muted-foreground">{s.label}</CardTitle>
            </CardHeader>
            <CardContent><p className={`text-2xl font-serif ${s.color || ""}`}>{s.value}</p></CardContent>
          </Card>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Preço Total</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead>Saldo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((v) => (
            <TableRow key={v.id}>
              <TableCell className="font-medium">{v.company}</TableCell>
              <TableCell>{v.category}</TableCell>
              <TableCell>{v.contact}</TableCell>
              <TableCell>{v.phone}</TableCell>
              <TableCell>{fmt(v.totalPrice)}</TableCell>
              <TableCell>{fmt(v.amountPaid)}</TableCell>
              <TableCell>{fmt(v.totalPrice - v.amountPaid)}</TableCell>
              <TableCell>
                <div className="flex gap-1 justify-end">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(v)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { deleteVendor(v.id); toast.success("Fornecedor removido"); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog fornecedor */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{editing ? "Editar Fornecedor" : "Novo Fornecedor"}</DialogTitle>
            <DialogDescription>Preencha os dados do fornecedor.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Empresa</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
            <div><Label>Categoria</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Buffet, Fotografia..." /></div>
            <div><Label>Contato</Label><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
            <div><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Preço Total</Label><Input type="number" value={form.totalPrice} onChange={(e) => setForm({ ...form, totalPrice: e.target.value })} /></div>
              <div><Label>Valor Pago</Label><Input type="number" value={form.amountPaid} onChange={(e) => setForm({ ...form, amountPaid: e.target.value })} /></div>
            </div>
            <div><Label>Observações</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editing ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog orçamento */}
      <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">Editar Orçamento Total</DialogTitle>
            <DialogDescription>Defina o valor total orçado para o casamento.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Valor Orçado (R$)</Label>
              <Input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                min={0}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              A soma dos serviços cadastrados atualmente é de <strong>{fmt(budgetStats.servicesTotal)}</strong>.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBudgetDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveBudget}>Salvar Orçamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
