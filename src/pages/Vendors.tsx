import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Vendor } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { BudgetSummaryCards } from "@/components/vendors/BudgetSummaryCards";
import { VendorTableRow } from "@/components/vendors/VendorTableRow";
import { VendorFormDialog } from "@/components/vendors/VendorFormDialog";
import { BudgetDialog } from "@/components/vendors/BudgetDialog";

export default function Vendors() {
  const { vendors, budgetStats, totalBudget, setTotalBudget, addVendor, updateVendor, deleteVendor } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(v: Vendor) {
    setEditing(v);
    setDialogOpen(true);
  }

  function handleSave(data: Omit<Vendor, "id">) {
    if (editing) {
      updateVendor(editing.id, data);
      toast.success("Fornecedor atualizado");
    } else {
      addVendor(data);
      toast.success("Fornecedor adicionado");
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    deleteVendor(id);
    toast.success("Fornecedor removido");
  }

  function handleSaveBudget(value: number) {
    setTotalBudget(value);
    toast.success("Orçamento atualizado");
    setBudgetDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-serif">Fornecedores</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="border-foreground/20" onClick={() => setBudgetDialogOpen(true)}>
            <DollarSign className="h-4 w-4 mr-2" /> Editar Orçamento
          </Button>
          <Button variant="outline" className="border-foreground/20" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" /> Novo Fornecedor
          </Button>
        </div>
      </div>

      <BudgetSummaryCards budgetStats={budgetStats} />

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
            <VendorTableRow key={v.id} vendor={v} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </TableBody>
      </Table>

      <VendorFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} onSave={handleSave} />
      <BudgetDialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen} currentBudget={totalBudget} budgetStats={budgetStats} onSave={handleSaveBudget} />
    </div>
  );
}
