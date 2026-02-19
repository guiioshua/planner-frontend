import { useState, ClipboardEvent, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { Invitation, InvitationType, RSVPStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Copy, MessageCircle, Pencil, Trash2, X, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

type FilterTab = "all" | "standard" | "godparent";
const statusLabels: Record<RSVPStatus, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  declined: "Recusado",
};

const statusColors: Record<RSVPStatus, string> = {
  pending: "bg-warning/20 text-warning border-warning/30",
  confirmed: "bg-success/20 text-success border-success/30",
  declined: "bg-destructive/20 text-destructive border-destructive/30",
};

export default function Invitations() {
  const { invitations, addInvitation, updateInvitation, deleteInvitation } = useApp();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Invitation | null>(null);

  // Form state
  const [familyName, setFamilyName] = useState("");
  const [type, setType] = useState<InvitationType>("standard");
  const [message, setMessage] = useState("");
  const [people, setPeople] = useState<{ name: string; phone: string; status: RSVPStatus }[]>([{ name: "", phone: "", status: "pending" }]);

  // Image handling
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = filter === "all" ? invitations : invitations.filter((i) => i.type === filter);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "standard", label: "Padrão" },
    { key: "godparent", label: "Padrinhos" },
  ];

  function resetForm() {
    setFamilyName("");
    setType("standard");
    setMessage("");
    setPeople([{ name: "", phone: "", status: "pending" }]);
    setCoverImageFile(null);
    setPreviewUrl("");
  }

  function openCreate() {
    setEditing(null);
    resetForm();
    setDialogOpen(true);
  }

  function openEdit(inv: Invitation) {
    setEditing(inv);
    setFamilyName(inv.familyName);
    setType(inv.type);
    setMessage(inv.message);
    setPeople(inv.people.map((p) => ({ name: p.name, phone: p.phone, status: p.status })));
    setPreviewUrl(inv.coverImageUrl);
    setCoverImageFile(null); // Reset file if editing, unless user picks a new one
    setDialogOpen(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
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

  async function handleSave() {
    const validPeople = people.filter((p) => p.name.trim());
    if (!familyName.trim()) return;

    try {
      const payload = {
        familyName,
        type,
        message, // Note: coverImageUrl is not passed in payload explicitly for update unless needed, but here we rely on file or existing
        coverImageUrl: editing?.coverImageUrl || "", // Satisfy type requirement
        people: validPeople.map((p) => ({
          id: crypto.randomUUID(), // Optimistic ID, hook handles logic
          name: p.name,
          phone: p.phone,
          status: p.status,
        })),
      };

      if (editing) {
        // For update, we pass the file if it exists. 
        // Logic in useInvitations will handle partial updates.
        await updateInvitation(editing.id, payload, coverImageFile || undefined);
        toast.success("Convite atualizado");
      } else {
        await addInvitation(payload, coverImageFile || undefined);
        toast.success("Convite criado");
      }
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar convite");
    }
  }

  function copyLink(slug: string) {
    const url = `${window.location.origin}/rsvp/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!");
  }

  function shareWhatsApp(inv: Invitation) {
    const url = `${window.location.origin}/rsvp/${inv.slug}`;
    const firstPerson = inv.people[0];
    const phone = firstPerson?.phone?.replace(/\D/g, ""); // Remove non-digits

    const text = encodeURIComponent(`${inv.familyName}, confirme sua presença: ${url}`);

    if (phone) {
      window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    } else {
      window.open(`https://wa.me/?text=${text}`, "_blank");
    }
  }

  function statusSummary(inv: Invitation) {
    const c = inv.people.filter((p) => p.status === "confirmed").length;
    const t = inv.people.length;
    return `${c}/${t}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif">Convites</h1>
        <Button variant="outline" className="border-foreground/20" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Novo Convite
        </Button>
      </div>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <Button
            key={t.key}
            variant={filter === t.key ? "default" : "outline"}
            size="sm"
            className={filter !== t.key ? "border-foreground/20" : ""}
            onClick={() => setFilter(t.key)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Família</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Pessoas</TableHead>
            <TableHead>Confirmados</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-medium">{inv.familyName}</TableCell>
              <TableCell>
                <Badge variant={inv.type === "godparent" ? "default" : "secondary"} className="text-xs">
                  {inv.type === "godparent" ? "Padrinho" : "Padrão"}
                </Badge>
              </TableCell>
              <TableCell>{inv.people.length}</TableCell>
              <TableCell>{statusSummary(inv)}</TableCell>
              <TableCell>
                <div className="flex gap-1 justify-end">
                  <Button variant="ghost" size="icon" onClick={() => copyLink(inv.slug)} title="Copiar link">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => shareWhatsApp(inv)} title="WhatsApp">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(inv)} title="Editar">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { deleteInvitation(inv.id); toast.success("Convite removido"); }} title="Excluir">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as InvitationType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Padrão</SelectItem>
                  <SelectItem value="godparent">Padrinho</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload Area */}
            <div>
              <Label>Imagem de Capa</Label>
              <div
                className="mt-1 border-2 border-dashed border-border/50 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {previewUrl ? (
                  <div className="relative w-full aspect-video rounded overflow-hidden mb-2">
                    <img src={previewUrl} alt="Capa" className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewUrl("");
                        setCoverImageFile(null);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4 text-muted-foreground">
                    <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">Clique para upload ou Ctrl+V</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Mensagem Personalizada</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Pessoas</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => setPeople([...people, { name: "", phone: "", status: "pending" }])}>
                  <Plus className="h-3 w-3 mr-1" /> Adicionar
                </Button>
              </div>
              {people.map((p, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input placeholder="Nome" value={p.name} className="flex-[2]" onChange={(e) => { const u = [...people]; u[i].name = e.target.value; setPeople(u); }} />
                  <Input placeholder="Telefone" value={p.phone} className="flex-1" onChange={(e) => { const u = [...people]; u[i].phone = e.target.value; setPeople(u); }} />
                  <Select value={p.status} onValueChange={(v) => { const u = [...people]; u[i].status = v as RSVPStatus; setPeople(u); }}>
                    <SelectTrigger className={`w-36 text-xs h-9 ${statusColors[p.status]}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="declined">Recusado</SelectItem>
                    </SelectContent>
                  </Select>
                  {people.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => setPeople(people.filter((_, j) => j !== i))}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editing ? "Salvar" : "Criar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
