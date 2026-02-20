import { useState, useEffect } from "react";
import type { Gift } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";

interface GiftFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing: Gift | null;
    onSave: (data: Omit<Gift, "id"> & { status: Gift["status"] }) => void;
}

export function GiftFormDialog({ open, onOpenChange, editing, onSave }: GiftFormDialogProps) {
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [purchaseLink, setPurchaseLink] = useState("");
    const [visible, setVisible] = useState(true);
    const [category, setCategory] = useState("A");

    useEffect(() => {
        if (open) {
            if (editing) {
                setName(editing.name);
                setImageUrl(editing.imageUrl);
                setPurchaseLink(editing.purchaseLink);
                setVisible(editing.visible);
                setCategory(editing.category);
            } else {
                setName("");
                setImageUrl("");
                setPurchaseLink("");
                setVisible(true);
                setCategory("A");
            }
        }
    }, [open, editing]);

    function handleSave() {
        if (!name.trim()) return;
        onSave({ name, imageUrl, purchaseLink, visible, category, status: editing?.status ?? "AVAILABLE", chosenByFamilyName: editing?.chosenByFamilyName ?? null });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>{editing ? "Salvar" : "Adicionar"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
