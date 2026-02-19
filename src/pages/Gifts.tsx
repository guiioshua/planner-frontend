import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Gift } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Pencil, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Gifts() {
  const { gifts, addGift, updateGift, deleteGift, toggleVisible } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Gift | null>(null);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [purchaseLink, setPurchaseLink] = useState("");
  const [visible, setVisible] = useState(true);
  const [category, setCategory] = useState("A");

  function resetForm() {
    setName("");
    setImageUrl("");
    setPurchaseLink("");
    setVisible(true);
    setCategory("A");
  }

  function openCreate() {
    setEditing(null);
    resetForm();
    setDialogOpen(true);
  }

  function openEdit(g: Gift) {
    setEditing(g);
    setName(g.name);
    setImageUrl(g.imageUrl);
    setPurchaseLink(g.purchaseLink);
    setVisible(g.visible);
    setCategory(g.category);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!name.trim()) return;
    try {
      if (editing) {
        await updateGift(editing.id, { name, imageUrl, purchaseLink, visible, category });
        toast.success("Presente atualizado");
      } else {
        console.log("Adding gift with category:", category);
        await addGift({ name, imageUrl, purchaseLink, visible, category, status: "AVAILABLE" });
        toast.success("Presente adicionado");
      }
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar presente");
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
          <Card key={g.id} className={`border border-border/50 shadow-none overflow-hidden ${!g.visible ? "opacity-60" : ""}`}>
            {g.imageUrl && (
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={g.imageUrl} alt={g.name} className="w-full h-full object-cover" />
                {g.status === "CHOSEN" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Badge variant="secondary" className="text-sm font-medium">ESCOLHIDO</Badge>
                  </div>
                )}
              </div>
            )}
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <h3 className="font-serif text-lg leading-tight">{g.name}</h3>
                  <Badge variant="outline" className="w-fit mt-1 text-[10px]">{g.category}</Badge>
                </div>
                {g.status === "AVAILABLE" ? (
                  <Badge variant="outline" className="text-[10px] ml-2 shrink-0">Livre</Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px] ml-2 shrink-0">Escolhido</Badge>
                )}
              </div>

              {g.status === "CHOSEN" && g.chosenByFamilyName && (
                <p className="text-xs text-muted-foreground">
                  Escolhido por: <span className="font-medium">{g.chosenByFamilyName}</span>
                </p>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Switch checked={g.visible} onCheckedChange={() => toggleVisible(g.id)} />
                  <span className="text-xs text-muted-foreground">{g.visible ? "Visível" : "Oculto"}</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(g)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={async () => { try { await deleteGift(g.id); toast.success("Presente removido"); } catch { toast.error("Erro ao remover presente"); } }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  {g.purchaseLink && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={g.purchaseLink} target="_blank" rel="noopener noreferrer">
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
            <div><Label>URL de Compra</Label><Input value={purchaseLink} onChange={(e) => setPurchaseLink(e.target.value)} /></div>
            <div>
              <Label>Categoria</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: A, B, C" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={visible} onCheckedChange={setVisible} />
              <Label>Visível na lista pública?</Label>
            </div>
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
