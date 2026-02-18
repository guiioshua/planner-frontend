import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Gift } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function Gifts() {
  const { gifts, addGift, updateGift, toggleActive } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Gift | null>(null);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [purchaseUrl, setPurchaseUrl] = useState("");

  function openCreate() {
    setEditing(null);
    setName("");
    setImageUrl("");
    setPurchaseUrl("");
    setDialogOpen(true);
  }

  function openEdit(g: Gift) {
    setEditing(g);
    setName(g.name);
    setImageUrl(g.imageUrl);
    setPurchaseUrl(g.purchaseUrl);
    setDialogOpen(true);
  }

  function handleSave() {
    if (!name.trim()) return;
    if (editing) {
      updateGift(editing.id, { name, imageUrl, purchaseUrl });
      toast.success("Presente atualizado");
    } else {
      addGift({ name, imageUrl, purchaseUrl, active: true });
      toast.success("Presente adicionado");
    }
    setDialogOpen(false);
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
          <Card key={g.id} className={`border border-border/50 shadow-none overflow-hidden ${!g.active ? "opacity-50" : ""}`}>
            {g.imageUrl && (
              <div className="aspect-[4/3] overflow-hidden">
                <img src={g.imageUrl} alt={g.name} className="w-full h-full object-cover" />
              </div>
            )}
            <CardContent className="p-4 space-y-3">
              <h3 className="font-serif text-lg">{g.name}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={g.active} onCheckedChange={() => toggleActive(g.id)} />
                  <span className="text-xs text-muted-foreground">{g.active ? "Ativo" : "Inativo"}</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(g)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  {g.purchaseUrl && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={g.purchaseUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">{editing ? "Editar Presente" : "Novo Presente"}</DialogTitle>
            <DialogDescription>Preencha os dados do presente.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>URL da Imagem</Label><Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /></div>
            <div><Label>URL de Compra</Label><Input value={purchaseUrl} onChange={(e) => setPurchaseUrl(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editing ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
