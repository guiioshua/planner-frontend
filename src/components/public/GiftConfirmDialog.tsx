import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";

interface GiftConfirmDialogProps {
    open: boolean;
    isChoosing: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function GiftConfirmDialog({ open, isChoosing, onConfirm, onCancel }: GiftConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel(); }}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="font-serif">Confirmar escolha</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja escolher este presente? Após confirmado, ele ficará marcado como escolhido para todos os convidados.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onCancel}>Cancelar</Button>
                    <Button onClick={onConfirm} disabled={isChoosing}>
                        {isChoosing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Aguarde...</> : "Confirmar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
