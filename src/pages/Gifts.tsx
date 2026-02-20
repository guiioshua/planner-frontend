import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Gift } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { GiftCard } from "@/components/GiftCard";
import { GiftFormDialog } from "@/components/gifts/GiftFormDialog";

export default function Gifts() {
  const { gifts, addGift, updateGift, deleteGift, toggleVisible } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Gift | null>(null);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(g: Gift) {
    setEditing(g);
    setDialogOpen(true);
  }

  async function handleSave(data: Omit<Gift, "id">) {
    try {
      if (editing) {
        await updateGift(editing.id, { name: data.name, imageUrl: data.imageUrl, purchaseLink: data.purchaseLink, visible: data.visible, category: data.category });
        toast.success("Presente atualizado");
      } else {
        await addGift({ name: data.name, imageUrl: data.imageUrl, purchaseLink: data.purchaseLink, visible: data.visible, category: data.category, status: "AVAILABLE" });
        toast.success("Presente adicionado");
      }
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar presente");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteGift(id);
      toast.success("Presente removido");
    } catch {
      toast.error("Erro ao remover presente");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif">Lista de Presentes</h1>
        <Button variant="outline" className="border-foreground/20" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Novo Presente
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gifts.map((g) => (
          <GiftCard key={g.id} gift={g} onEdit={openEdit} onDelete={handleDelete} onToggleVisible={toggleVisible} />
        ))}
      </div>

      <GiftFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} onSave={handleSave} />
    </div>
  );
}
