import type { BudgetStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface BudgetSummaryCardsProps {
    budgetStats: BudgetStats;
}

export function BudgetSummaryCards({ budgetStats }: BudgetSummaryCardsProps) {
    const items = [
        { label: "Total Orçado", value: formatCurrency(budgetStats.totalBudget) },
        { label: "Total Pago", value: formatCurrency(budgetStats.totalPaid), color: "text-success" },
        { label: "Restante", value: formatCurrency(budgetStats.remaining), color: "text-warning" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((s) => (
                <Card key={s.label} className="border border-border/50 shadow-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-sans font-normal uppercase tracking-wider text-muted-foreground">{s.label}</CardTitle>
                    </CardHeader>
                    <CardContent><p className={`text-2xl font-serif ${s.color || ""}`}>{s.value}</p></CardContent>
                </Card>
            ))}
        </div>
    );
}
