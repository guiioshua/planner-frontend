import { useState, useEffect } from "react";
import type { Vendor } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";

interface VendorFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editing: Vendor | null;
    onSave: (data: Omit<Vendor, "id">) => void;
}

export function VendorFormDialog({ open, onOpenChange, editing, onSave }: VendorFormDialogProps) {
    const [form, setForm] = useState({ company: "", category: "", contact: "", phone: "", totalPrice: "", amountPaid: "", notes: "" });

    useEffect(() => {
        if (open) {
            if (editing) {
                setForm({
                    company: editing.company, category: editing.category, contact: editing.contact, phone: editing.phone,
                    totalPrice: String(editing.totalPrice), amountPaid: String(editing.amountPaid), notes: editing.notes,
                });
            } else {
                setForm({ company: "", category: "", contact: "", phone: "", totalPrice: "", amountPaid: "", notes: "" });
            }
        }
    }, [open, editing]);

    function handleSave() {
        if (!form.company.trim()) return;
        onSave({
            company: form.company, category: form.category, contact: form.contact, phone: form.phone,
            totalPrice: Number(form.totalPrice) || 0, amountPaid: Number(form.amountPaid) || 0, notes: form.notes,
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-serif">{editing ? "Editar Fornecedor" : "Novo Fornecedor"}</DialogTitle>
                    <DialogDescription>Preencha os dados do fornecedor.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div><Label>Empresa</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
                    <div><Label>Categoria</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Buffet, Fotografia..." /></div>
                    <div><Label>Contato</Label><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
                    <div><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Preço Total</Label><Input type="number" value={form.totalPrice} onChange={(e) => setForm({ ...form, totalPrice: e.target.value })} /></div>
                        <div><Label>Valor Pago</Label><Input type="number" value={form.amountPaid} onChange={(e) => setForm({ ...form, amountPaid: e.target.value })} /></div>
                    </div>
                    <div><Label>Observações</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} /></div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>{editing ? "Salvar" : "Adicionar"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
