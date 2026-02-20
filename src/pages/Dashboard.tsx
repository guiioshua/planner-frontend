import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BotanicalAccent } from "@/components/BotanicalAccent";
import { Mail, Users, Clock, UserX, Heart, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";

export default function Dashboard() {
  const { stats, budgetStats } = useApp();
  const navigate = useNavigate();

  const summaryCards = [
    { label: "Convites", value: stats.totalInvitations, icon: Mail, subValue: `Crianças: ${stats.totalChildren}` },
    { label: "Confirmados", value: stats.confirmedGuests, icon: Users, subValue: `Crianças: ${stats.confirmedChildren}` },
    { label: "Pendentes", value: stats.pendingGuests, icon: Clock },
    { label: "Recusados", value: stats.declinedGuests, icon: UserX },
    { label: "Padrinhos Confirmados", value: stats.godparentConfirmed, icon: Heart },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-serif">Painel</h1>
          <p className="text-sm text-muted-foreground mt-1">Resumo do seu casamento</p>
        </div>
        <BotanicalAccent variant="branch" className="w-32 opacity-30 hidden md:block" />
      </div>

      {/* Summary Cards */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {summaryCards.map((c) => (
          <Card key={c.label} className="border border-border/50 shadow-none">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-sans font-normal uppercase tracking-wider text-muted-foreground">
                  {c.label}
                </CardTitle>
                <c.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-serif">{c.value}</p>
              {c.subValue && <p className="text-xs text-muted-foreground mt-1">{c.subValue}</p>}
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Budget Overview */}
      <section>
        <h2 className="text-xl font-serif mb-4">Orçamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-border/50 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-sans font-normal uppercase tracking-wider text-muted-foreground">
                Total Orçado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-serif">{formatCurrency(budgetStats.totalBudget)}</p>
            </CardContent>
          </Card>
          <Card className="border border-border/50 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-sans font-normal uppercase tracking-wider text-muted-foreground">
                Total Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-serif text-success">{formatCurrency(budgetStats.totalPaid)}</p>
            </CardContent>
          </Card>
          <Card className="border border-border/50 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-sans font-normal uppercase tracking-wider text-muted-foreground">
                Restante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-serif text-warning">{formatCurrency(budgetStats.remaining)}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-serif mb-4">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="border-foreground/20 hover:bg-muted"
            onClick={() => navigate("/convites")}
          >
            <Plus className="h-4 w-4 mr-2" /> Criar Convite
          </Button>
          <Button
            variant="outline"
            className="border-foreground/20 hover:bg-muted"
            onClick={() => navigate("/presentes")}
          >
            <Plus className="h-4 w-4 mr-2" /> Adicionar Presente
          </Button>
          <Button
            variant="outline"
            className="border-foreground/20 hover:bg-muted"
            onClick={() => navigate("/fornecedores")}
          >
            <Plus className="h-4 w-4 mr-2" /> Adicionar Fornecedor
          </Button>
        </div>
      </section>
    </div>
  );
}
