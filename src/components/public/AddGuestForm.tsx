import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus } from "lucide-react";
import { addGuestToInvitation } from "@/lib/api";
import { toast } from "sonner";

interface AddGuestFormProps {
    slug: string;
    onAdded: () => void;
}

export function AddGuestForm({ slug, onAdded }: AddGuestFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [isChild, setIsChild] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    async function handleAdd() {
        if (!name.trim()) return;
        setIsAdding(true);
        try {
            await addGuestToInvitation(slug, {
                fullName: name,
                phone,
                isChild,
                status: "confirmed"
            });
            toast.success("Pessoa adicionada!");
            setName("");
            setPhone("");
            setIsChild(false);
            setIsExpanded(false);
            onAdded();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao adicionar pessoa");
        } finally {
            setIsAdding(false);
        }
    }

    if (!isExpanded) {
        return (
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(true)} className="w-full border-dashed">
                <Plus className="h-4 w-4 mr-2" /> Adicionar pessoa
            </Button>
        );
    }

    return (
        <div className="space-y-3 bg-muted/30 p-3 rounded-md border border-border/20 animate-in fade-in slide-in-from-top-1">
            <div className="space-y-1">
                <Label className="text-xs">Nome completo</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Maria Silva" className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Telefone (opcional)</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ex: 11 99999-9999" className="h-8 text-sm" />
            </div>
            <div className="flex items-center gap-2">
                <Switch checked={isChild} onCheckedChange={setIsChild} id="is-child-add" className="scale-75 origin-left" />
                <Label htmlFor="is-child-add" className="text-xs cursor-pointer">Criança</Label>
            </div>
            <div className="flex gap-2 pt-2">
                <Button size="sm" variant="ghost" className="flex-1 h-8" onClick={() => setIsExpanded(false)}>Cancelar</Button>
                <Button size="sm" className="flex-1 h-8" onClick={handleAdd} disabled={isAdding || !name.trim()}>
                    {isAdding ? <Loader2 className="h-3 w-3 animate-spin" /> : "Adicionar"}
                </Button>
            </div>
        </div>
    );
}
