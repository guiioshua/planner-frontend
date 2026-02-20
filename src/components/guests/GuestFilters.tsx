import type { RSVPStatus, InvitationType } from "@/types";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface GuestFiltersProps {
    statusFilter: RSVPStatus | "all";
    typeFilter: InvitationType | "all";
    onStatusChange: (value: RSVPStatus | "all") => void;
    onTypeChange: (value: InvitationType | "all") => void;
}

export function GuestFilters({ statusFilter, typeFilter, onStatusChange, onTypeChange }: GuestFiltersProps) {
    return (
        <div className="flex gap-3 flex-wrap">
            <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as RSVPStatus | "all")}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="declined">Recusado</SelectItem>
                </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => onTypeChange(v as InvitationType | "all")}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="standard">Padrão</SelectItem>
                    <SelectItem value="godparent">Padrinho</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
