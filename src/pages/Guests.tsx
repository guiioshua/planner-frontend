import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { RSVPStatus, InvitationType, GuestWithMeta } from "@/types";
import {
  Table, TableBody, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { GuestFilters } from "@/components/guests/GuestFilters";
import { GuestTableRow } from "@/components/guests/GuestTableRow";
import { toast } from "sonner";

export default function Guests() {
  const { allGuests, confirmRSVP } = useApp();
  const [statusFilter, setStatusFilter] = useState<RSVPStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<InvitationType | "all">("all");

  const handleStatusChange = async (guest: GuestWithMeta, newStatus: RSVPStatus) => {
    try {
      await confirmRSVP(guest.invitationSlug, { [guest.id]: newStatus });
      toast.success(`Status de ${guest.name} atualizado`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar status");
    }
  };

  const filtered = allGuests.filter((g) => {
    if (statusFilter !== "all" && g.status !== statusFilter) return false;
    if (typeFilter !== "all" && g.invitationType !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif">Convidados</h1>

      <GuestFilters
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Família</TableHead>
            <TableHead>Convite</TableHead>
            <TableHead>Público</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((g) => (
            <GuestTableRow key={g.id} guest={g} onStatusChange={handleStatusChange} />
          ))}
        </TableBody>
      </Table>
      <p className="text-sm text-muted-foreground">{filtered.length} convidado(s)</p>
    </div>
  );
}
