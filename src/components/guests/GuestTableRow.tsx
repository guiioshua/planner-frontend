import type { GuestWithMeta, RSVPStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Baby, User } from "lucide-react";

interface GuestTableRowProps {
    guest: GuestWithMeta;
    onStatusChange: (guest: GuestWithMeta, newStatus: RSVPStatus) => void;
}

export function GuestTableRow({ guest: g, onStatusChange }: GuestTableRowProps) {
    return (
        <TableRow>
            <TableCell className="font-medium">{g.name}</TableCell>
            <TableCell>{g.phone}</TableCell>
            <TableCell>{g.familyName}</TableCell>
            <TableCell>
                <Badge variant="secondary" className="text-xs">
                    {g.invitationType === "godparent" ? "Padrinho" : "Padrão"}
                </Badge>
            </TableCell>
            <TableCell>
                {g.isChild ? (
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary flex w-fit items-center gap-1">
                        <Baby className="h-3 w-3" /> Criança
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground flex w-fit items-center gap-1">
                        <User className="h-3 w-3" /> Adulto
                    </Badge>
                )}
            </TableCell>
            <TableCell>
                <StatusBadge status={g.status} onChange={(newStatus) => onStatusChange(g, newStatus)} />
            </TableCell>
        </TableRow>
    );
}
