import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Invitation, InvitationType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { InvitationTableRow } from "@/components/invitations/InvitationTableRow";
import { InvitationFormDialog } from "@/components/invitations/InvitationFormDialog";

type FilterTab = "all" | "standard" | "godparent";

export default function Invitations() {
  const { invitations, addInvitation, updateInvitation, deleteInvitation } = useApp();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Invitation | null>(null);

  const filtered = filter === "all" ? invitations : invitations.filter((i) => i.type === filter);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "standard", label: "Padrão" },
    { key: "godparent", label: "Padrinhos" },
  ];

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(inv: Invitation) {
    setEditing(inv);
    setDialogOpen(true);
  }

  async function handleSave(data: Omit<Invitation, "id" | "slug" | "createdAt">, file?: File) {
    try {
      if (editing) {
        await updateInvitation(editing.id, data, file);
        toast.success("Convite atualizado");
      } else {
        await addInvitation(data, file);
        toast.success("Convite criado");
      }
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar convite");
    }
  }

  function handleDelete(id: string) {
    deleteInvitation(id);
    toast.success("Convite removido");
  }

  function copyLink(slug: string) {
    const url = `${window.location.origin}/rsvp/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!");
  }

  function shareWhatsApp(inv: Invitation) {
    const url = `${window.location.origin}/rsvp/${inv.slug}`;
    const firstPerson = inv.people[0];
    const phone = firstPerson?.phone?.replace(/\D/g, "");

    const customMessage = inv.message?.trim();
    const text = encodeURIComponent(
      customMessage
        ? `${customMessage}\n\n${url}`
        : `${inv.familyName}, confirme sua presença: ${url}`
    );

    if (phone) {
      window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    } else {
      window.open(`https://wa.me/?text=${text}`, "_blank");
    }
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
            <TableHead>Categoria</TableHead>
            <TableHead>Pessoas</TableHead>
            <TableHead>Confirmados</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((inv) => (
            <InvitationTableRow
              key={inv.id}
              invitation={inv}
              onCopyLink={copyLink}
              onWhatsApp={shareWhatsApp}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </TableBody>
      </Table>

      <InvitationFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} onSave={handleSave} />
    </div>
  );
}
