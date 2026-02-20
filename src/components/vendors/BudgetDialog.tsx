import { useState, useEffect } from "react";
import type { BudgetStats } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface BudgetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentBudget: number;
    budgetStats: BudgetStats;
    onSave: (value: number) => void;
}

export function BudgetDialog({ open, onOpenChange, currentBudget, budgetStats, onSave }: BudgetDialogProps) {
    const [budgetInput, setBudgetInput] = useState("");

    useEffect(() => {
        if (open) {
            setBudgetInput(String(currentBudget ?? 0));
        }
    }, [open, currentBudget]);

    function handleSave() {
        const value = Number(budgetInput.replace(",", "."));
        if (Number.isNaN(value) || value < 0) {
            toast.error("Informe um valor de orçamento válido.");
            return;
        }
        onSave(value);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="font-serif">Editar Orçamento Total</DialogTitle>
                    <DialogDescription>Defina o valor total orçado para o casamento.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Valor Orçado (R$)</Label>
                        <Input
                            type="number"
                            value={budgetInput}
                            onChange={(e) => setBudgetInput(e.target.value)}
                            min={0}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        A soma dos serviços cadastrados atualmente é de <strong>{formatCurrency(budgetStats.servicesTotal)}</strong>.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Salvar Orçamento</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
