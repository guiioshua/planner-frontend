import type { Vendor } from "@/types";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface VendorTableRowProps {
    vendor: Vendor;
    onEdit: (vendor: Vendor) => void;
    onDelete: (id: string) => void;
}

export function VendorTableRow({ vendor: v, onEdit, onDelete }: VendorTableRowProps) {
    return (
        <TableRow>
            <TableCell className="font-medium">{v.company}</TableCell>
            <TableCell>{v.category}</TableCell>
            <TableCell>{v.contact}</TableCell>
            <TableCell>{v.phone}</TableCell>
            <TableCell>{formatCurrency(v.totalPrice)}</TableCell>
            <TableCell>{formatCurrency(v.amountPaid)}</TableCell>
            <TableCell>{formatCurrency(v.totalPrice - v.amountPaid)}</TableCell>
            <TableCell>
                <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(v)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(v.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
            </TableCell>
        </TableRow>
    );
}
