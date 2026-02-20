import { useState, ClipboardEvent } from "react";
import type { Invitation, InvitationType, RSVPStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { ImageUploadArea } from "@/components/invitations/ImageUploadArea";
import { PersonRow, type PersonFormData } from "@/components/invitations/PersonRow";

interface InvitationFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing: Invitation | null;
    onSave: (data: Omit<Invitation, "id" | "slug" | "createdAt">, file?: File) => Promise<void>;
}

export function InvitationFormDialog({ open, onOpenChange, editing, onSave }: InvitationFormDialogProps) {
    const [familyName, setFamilyName] = useState("");
    const [type, setType] = useState<InvitationType>("standard");
    const [message, setMessage] = useState("");
    const [categories, setCategories] = useState("A");
    const [people, setPeople] = useState<PersonFormData[]>([{ name: "", phone: "", status: "pending", isChild: false }]);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    // Reset form when dialog opens
    const [lastOpenState, setLastOpenState] = useState(false);
    if (open !== lastOpenState) {
        setLastOpenState(open);
        if (open) {
            if (editing) {
                setFamilyName(editing.familyName);
                setType(editing.type);
                setMessage(editing.message);
                setCategories(editing.categories ? editing.categories.join(", ") : "A");
                setPeople(editing.people.map((p) => ({ name: p.name, phone: p.phone, status: p.status, isChild: p.isChild })));
                setPreviewUrl(editing.coverImageUrl);
                setCoverImageFile(null);
            } else {
                setFamilyName("");
                setType("standard");
                setMessage("");
                setCategories("A");
                setPeople([{ name: "", phone: "", status: "pending", isChild: false }]);
                setCoverImageFile(null);
                setPreviewUrl("");
            }
        }
    }

    function handlePaste(e: ClipboardEvent) {
        if (e.clipboardData.files && e.clipboardData.files.length > 0) {
            const file = e.clipboardData.files[0];
            if (file.type.startsWith("image/")) {
                setCoverImageFile(file);
                setPreviewUrl(URL.createObjectURL(file));
                e.preventDefault();
            }
        }
    }

    function handleFileSelected(file: File) {
        setCoverImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    }

    function handleClearImage() {
        setPreviewUrl("");
        setCoverImageFile(null);
    }

    function handlePersonChange(index: number, data: PersonFormData) {
        const updated = [...people];
        updated[index] = data;
        setPeople(updated);
    }

    function handlePersonRemove(index: number) {
        setPeople(people.filter((_, j) => j !== index));
    }

    async function handleSave() {
        const validPeople = people.filter((p) => p.name.trim());
        if (!familyName.trim()) return;

        const payload: Omit<Invitation, "id" | "slug" | "createdAt"> = {
            familyName,
            type,
            message,
            categories: categories.split(",").map(c => c.trim()).filter(c => c),
            coverImageUrl: editing?.coverImageUrl || "",
            people: validPeople.map((p) => ({
                id: crypto.randomUUID(), // Placeholder — server assigns the canonical ID
                name: p.name,
                phone: p.phone,
                status: p.status,
                isChild: p.isChild,
            })),
        };

        await onSave(payload, coverImageFile || undefined);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" onPaste={handlePaste}>
                <DialogHeader>
                    <DialogTitle className="font-serif">{editing ? "Editar Convite" : "Novo Convite"}</DialogTitle>
                    <DialogDescription>Preencha os dados. Cole uma imagem (Ctrl+V) para a capa.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Nome da Família</Label>
                        <Input value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="Família Silva" />
                    </div>
                    <div>
                        <Label>Convidado ou Padrinho</Label>
                        <Select value={type} onValueChange={(v) => setType(v as InvitationType)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="standard">Padrão (Convidado)</SelectItem>
                                <SelectItem value="godparent">Padrinho</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <Label>Categorias</Label>
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-[220px] text-xs leading-snug">
                                        Quem receber esse convite verá apenas os presentes das categorias atribuídas a ele. Use para segmentar por faixa de preço ou perfil. Um convidado pode pertencer a várias categorias.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Input value={categories} onChange={(e) => setCategories(e.target.value)} placeholder="Ex: Barato, Médio, Caro" />
                        <p className="text-[10px] text-muted-foreground">Separe por vírgula (ex: Barato, Médio, Caro)</p>
                    </div>

                    <ImageUploadArea previewUrl={previewUrl} onFileChange={handleFileSelected} onClear={handleClearImage} />

                    <div>
                        <Label>Mensagem Personalizada</Label>
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            placeholder="Ex: Família Silva, é com enorme alegria que os convidamos para celebrar nosso casamento. Confirme sua presença pelo link abaixo 💌"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">Esta mensagem será usada no envio pelo WhatsApp.</p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label>Pessoas</Label>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setPeople([...people, { name: "", phone: "", status: "pending", isChild: false }])}>
                                <Plus className="h-3 w-3 mr-1" /> Adicionar
                            </Button>
                        </div>

                        <Alert className="mb-4 py-2 bg-muted/50 border-dashed">
                            <Info className="h-4 w-4" />
                            <AlertDescription className="text-xs text-muted-foreground ml-2">
                                Convidados podem adicionar e confirmar acompanhantes diretamente na página de RSVP pública.
                            </AlertDescription>
                        </Alert>

                        {people.map((p, i) => (
                            <PersonRow
                                key={i}
                                person={p}
                                index={i}
                                total={people.length}
                                onChange={handlePersonChange}
                                onRemove={handlePersonRemove}
                            />
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>{editing ? "Salvar" : "Criar"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
