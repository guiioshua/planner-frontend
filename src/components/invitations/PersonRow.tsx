import type { RSVPStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { RSVP_STATUS_COLORS } from "@/lib/constants";

export interface PersonFormData {
    name: string;
    phone: string;
    status: RSVPStatus;
    isChild: boolean;
}

interface PersonRowProps {
    person: PersonFormData;
    index: number;
    total: number;
    onChange: (index: number, data: PersonFormData) => void;
    onRemove: (index: number) => void;
}

export function PersonRow({ person: p, index: i, total, onChange, onRemove }: PersonRowProps) {
    function update(patch: Partial<PersonFormData>) {
        onChange(i, { ...p, ...patch });
    }

    return (
        <div className="space-y-2 mb-4 p-3 border border-border/50 rounded-lg">
            <div className="flex gap-2">
                <Input placeholder="Nome" value={p.name} className="flex-[2]" onChange={(e) => update({ name: e.target.value })} />
                <Input placeholder="Telefone" value={p.phone} className="flex-1" onChange={(e) => update({ phone: e.target.value })} />
                {total > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(i)}>
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center gap-4">
                <Select value={p.status} onValueChange={(v) => update({ status: v as RSVPStatus })}>
                    <SelectTrigger className={`w-36 text-xs h-9 ${RSVP_STATUS_COLORS[p.status]}`}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="confirmed">Confirmado</SelectItem>
                        <SelectItem value="declined">Recusado</SelectItem>
                    </SelectContent>
                </Select>

                <label className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80">
                    <input
                        type="checkbox"
                        checked={p.isChild}
                        onChange={(e) => update({ isChild: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>Criança</span>
                </label>
            </div>
        </div>
    );
}
