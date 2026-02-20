import type { Invitation } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Copy, MessageCircle, Pencil, Trash2 } from "lucide-react";

interface InvitationTableRowProps {
    invitation: Invitation;
    onCopyLink: (slug: string) => void;
    onWhatsApp: (invitation: Invitation) => void;
    onEdit: (invitation: Invitation) => void;
    onDelete: (id: string) => void;
}

export function InvitationTableRow({ invitation: inv, onCopyLink, onWhatsApp, onEdit, onDelete }: InvitationTableRowProps) {
    const confirmed = inv.people.filter((p) => p.status === "confirmed").length;
    const total = inv.people.length;
    const childrenCount = inv.people.filter(p => p.isChild).length;

    return (
        <TableRow>
            <TableCell className="font-medium">{inv.familyName}</TableCell>
            <TableCell>
                <Badge variant={inv.type === "godparent" ? "default" : "secondary"} className="text-xs">
                    {inv.type === "godparent" ? "Padrinho" : "Padrão"}
                </Badge>
            </TableCell>
            <TableCell>
                {inv.categories && inv.categories.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                        {inv.categories.map(c => <Badge key={c} variant="outline" className="text-[9px] px-1 h-4">{c}</Badge>)}
                    </div>
                )}
            </TableCell>
            <TableCell>
                <div>{total}</div>
                {childrenCount > 0 && (
                    <div className="text-[10px] text-muted-foreground">
                        Crianças: {childrenCount}
                    </div>
                )}
            </TableCell>
            <TableCell>{confirmed}/{total}</TableCell>
            <TableCell>
                <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => onCopyLink(inv.slug)} title="Copiar link">
                        <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onWhatsApp(inv)} title="WhatsApp">
                        <MessageCircle className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(inv)} title="Editar">
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(inv.id)} title="Excluir">
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}
