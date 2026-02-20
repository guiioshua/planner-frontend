import type { RSVPStatus } from "@/types";

export const RSVP_STATUS_LABELS: Record<RSVPStatus, string> = {
    pending: "Pendente",
    confirmed: "Confirmado",
    declined: "Recusado",
};

export const RSVP_STATUS_COLORS: Record<RSVPStatus, string> = {
    pending: "bg-warning/20 text-warning border-warning/30",
    confirmed: "bg-success/20 text-success border-success/30",
    declined: "bg-destructive/20 text-destructive border-destructive/30",
};
