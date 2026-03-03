import { useState, useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Loader2, Copy, Check, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { generatePixPayload } from "@/utils/PixUtils";
import { toast } from "sonner";

interface PixModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pixKey: string;
    receiverName?: string | null;
    invitationId: string;
    onConfirmPayment: (amount: number) => Promise<void>;
}

export function PixModal({
    open,
    onOpenChange,
    pixKey,
    receiverName,
    invitationId,
    onConfirmPayment,
}: PixModalProps) {
    const [amountStr, setAmountStr] = useState("");
    const [copied, setCopied] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const amount = parseFloat(amountStr.replace(",", "."));
    const isValidAmount = !isNaN(amount) && amount > 0;

    const pixPayload = useMemo(() => {
        if (!isValidAmount) return null;
        return generatePixPayload({
            pixKey,
            amount,
            receiverName: receiverName ?? undefined,
        });
    }, [pixKey, amount, receiverName, isValidAmount]);

    async function handleCopy() {
        if (!pixPayload) return;
        await navigator.clipboard.writeText(pixPayload);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    async function handleConfirm() {
        if (!isValidAmount) return;
        setSubmitting(true);
        try {
            await onConfirmPayment(amount);
            toast.success("Pagamento registrado! O noivo irá confirmar em breve. 💚");
            onOpenChange(false);
            setAmountStr("");
        } catch {
            toast.error("Erro ao registrar o pagamento. Tente novamente.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="font-serif text-xl flex items-center gap-2">
                        <QrCode className="h-5 w-5" /> Me faça um Pix
                    </DialogTitle>
                    <DialogDescription>
                        Digite o valor do seu presente e escaneie o QR Code / copie o código.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="pix-amount">Valor (R$)</Label>
                        <Input
                            id="pix-amount"
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="Ex: 50,00"
                            value={amountStr}
                            onChange={(e) => setAmountStr(e.target.value)}
                        />
                    </div>

                    {isValidAmount && pixPayload && (
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-3 bg-white rounded-xl border border-border shadow-sm">
                                <QRCodeCanvas
                                    value={pixPayload}
                                    size={200}
                                    level="M"
                                    includeMargin
                                />
                            </div>

                            <div className="w-full">
                                <Label className="text-xs text-muted-foreground mb-1 block">
                                    Copia e Cola
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        readOnly
                                        value={pixPayload}
                                        className="text-xs font-mono"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleCopy}
                                        aria-label="Copiar código Pix"
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <p className="text-sm font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-center">
                                Volte aqui para confirmar seu presente após realizar o Pix.
                            </p>
                        </div>
                    )}

                    <Button
                        className="w-full"
                        onClick={handleConfirm}
                        disabled={!isValidAmount || submitting}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Registrando...
                            </>
                        ) : (
                            "Confirmar o envio do presente"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
