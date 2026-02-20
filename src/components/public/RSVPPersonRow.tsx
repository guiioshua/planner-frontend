import type { Person } from "@/types";
import { Switch } from "@/components/ui/switch";

interface RSVPPersonRowProps {
    person: Person;
    isConfirmed: boolean;
    onToggle: (personId: string, confirmed: boolean) => void;
}

export function RSVPPersonRow({ person: p, isConfirmed, onToggle }: RSVPPersonRowProps) {
    return (
        <div className="flex items-center justify-between border border-border/50 rounded-sm p-4">
            <span className="font-medium">{p.name}</span>
            <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                    {isConfirmed ? "Vou" : "Não vou"}
                </span>
                <Switch
                    checked={isConfirmed}
                    onCheckedChange={(checked) => onToggle(p.id, checked)}
                />
            </div>
        </div>
    );
}
