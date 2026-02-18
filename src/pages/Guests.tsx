import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { RSVPStatus, InvitationType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

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

export default function Guests() {
  const { allGuests } = useApp();
  const [statusFilter, setStatusFilter] = useState<RSVPStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<InvitationType | "all">("all");

  const filtered = allGuests.filter((g) => {
    if (statusFilter !== "all" && g.status !== statusFilter) return false;
    if (typeFilter !== "all" && g.invitationType !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif">Convidados</h1>

      <div className="flex gap-3 flex-wrap">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as RSVPStatus | "all")}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="confirmed">Confirmado</SelectItem>
            <SelectItem value="declined">Recusado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as InvitationType | "all")}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="standard">Padrão</SelectItem>
            <SelectItem value="godparent">Padrinho</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Família</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((g) => (
            <TableRow key={g.id}>
              <TableCell className="font-medium">{g.name}</TableCell>
              <TableCell>{g.phone}</TableCell>
              <TableCell>{g.familyName}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs">
                  {g.invitationType === "godparent" ? "Padrinho" : "Padrão"}
                </Badge>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs ${statusColors[g.status]}`}>
                  {statusLabels[g.status]}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-sm text-muted-foreground">{filtered.length} convidado(s)</p>
    </div>
  );
}
