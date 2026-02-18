import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Invitation, InvitationType, Person } from "@/types";
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
import { Plus, Copy, MessageCircle, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

type FilterTab = "all" | "standard" | "godparent";

export default function Invitations() {
  const { invitations, addInvitation, updateInvitation, deleteInvitation } = useApp();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Invitation | null>(null);

  // Form state
  const [familyName, setFamilyName] = useState("");
  const [type, setType] = useState<InvitationType>("standard");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [people, setPeople] = useState<{ name: string; phone: string }[]>([{ name: "", phone: "" }]);

  const filtered = filter === "all" ? invitations : invitations.filter((i) => i.type === filter);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "standard", label: "Padrão" },
    { key: "godparent", label: "Padrinhos" },
  ];

  function openCreate() {
    setEditing(null);
    setFamilyName("");
    setType("standard");
    setCoverImageUrl("");
    setMessage("");
    setPeople([{ name: "", phone: "" }]);
    setDialogOpen(true);
  }

  function openEdit(inv: Invitation) {
    setEditing(inv);
    setFamilyName(inv.familyName);
    setType(inv.type);
    setCoverImageUrl(inv.coverImageUrl);
    setMessage(inv.message);
    setPeople(inv.people.map((p) => ({ name: p.name, phone: p.phone })));
    setDialogOpen(true);
  }

  function handleSave() {
    const validPeople = people.filter((p) => p.name.trim());
    if (!familyName.trim()) return;

    if (editing) {
      updateInvitation(editing.id, {
        familyName,
        type,
        coverImageUrl,
        message,
        people: validPeople.map((p, i) => ({
          id: editing.people[i]?.id || crypto.randomUUID(),
          name: p.name,
          phone: p.phone,
          status: editing.people[i]?.status || "pending",
        })),
      });
      toast.success("Convite atualizado");
    } else {
      addInvitation({
        familyName,
        type,
        coverImageUrl,
        message,
        people: validPeople.map((p) => ({
          id: crypto.randomUUID(),
          name: p.name,
          phone: p.phone,
          status: "pending" as const,
        })),
      });
      toast.success("Convite criado");
    }
    setDialogOpen(false);
  }

  function copyLink(slug: string) {
    const url = `${window.location.origin}/rsvp/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!");
  }

  function shareWhatsApp(inv: Invitation) {
    const url = `${window.location.origin}/rsvp/${inv.slug}`;
    const text = encodeURIComponent(`${inv.familyName}, confirme sua presença: ${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{editing ? "Editar Convite" : "Novo Convite"}</DialogTitle>
            <DialogDescription>Preencha os dados do convite.</DialogDescription>
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
            <div>
              <Label>URL da Imagem de Capa</Label>
              <Input value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <Label>Mensagem Personalizada</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Pessoas</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => setPeople([...people, { name: "", phone: "" }])}>
                  <Plus className="h-3 w-3 mr-1" /> Adicionar
                </Button>
              </div>
              {people.map((p, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input placeholder="Nome" value={p.name} onChange={(e) => { const u = [...people]; u[i].name = e.target.value; setPeople(u); }} />
                  <Input placeholder="Telefone" value={p.phone} onChange={(e) => { const u = [...people]; u[i].phone = e.target.value; setPeople(u); }} />
                  {people.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => setPeople(people.filter((_, j) => j !== i))}>
                      <X className="h-3 w-3" />
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
