import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RSVPStatus } from "@/types";
import { RSVP_STATUS_LABELS, RSVP_STATUS_COLORS } from "@/lib/constants";

interface StatusBadgeProps {
    status: RSVPStatus;
    /** If provided, renders an interactive select instead of a static badge. */
    onChange?: (newStatus: RSVPStatus) => void;
}

export function StatusBadge({ status, onChange }: StatusBadgeProps) {
    if (onChange) {
        return (
            <Select value={status} onValueChange={(v) => onChange(v as RSVPStatus)}>
                <SelectTrigger className={`w-36 text-xs h-8 ${RSVP_STATUS_COLORS[status]}`}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="declined">Recusado</SelectItem>
                </SelectContent>
            </Select>
        );
    }

    return (
        <Badge className={`text-xs border ${RSVP_STATUS_COLORS[status]}`}>
            {RSVP_STATUS_LABELS[status]}
        </Badge>
    );
}
