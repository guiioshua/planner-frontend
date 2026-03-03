import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { usePix } from "@/hooks/usePix";
import { Gift } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Gift as GiftIcon, QrCode, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { GiftCard } from "@/components/GiftCard";
import { GiftFormDialog } from "@/components/gifts/GiftFormDialog";
import { formatCurrency } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Gifts() {
  const { gifts, addGift, updateGift, deleteGift, toggleVisible } = useApp();
  const {
    pixConfig,
    transactions,
    confirmedTotal,
    pendingTotal,
    saveConfig,
    updateStatus,
    isLoadingTransactions,
  } = usePix();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Gift | null>(null);

  // Pix config form state
  const [pixKey, setPixKey] = useState(pixConfig?.pixKey ?? "");
  const [receiverName, setReceiverName] = useState(pixConfig?.receiverName ?? "");
  const [savingConfig, setSavingConfig] = useState(false);

  // Sync form fields when pixConfig loads from backend
  useEffect(() => {
    if (pixConfig) {
      setPixKey(pixConfig.pixKey ?? "");
      setReceiverName(pixConfig.receiverName ?? "");
    }
  }, [pixConfig]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(g: Gift) {
    setEditing(g);
    setDialogOpen(true);
  }

  async function handleSave(data: Omit<Gift, "id">) {
    try {
      if (editing) {
        await updateGift(editing.id, { name: data.name, imageUrl: data.imageUrl, purchaseLink: data.purchaseLink, visible: data.visible, category: data.category });
        toast.success("Presente atualizado");
      } else {
        await addGift({ name: data.name, imageUrl: data.imageUrl, purchaseLink: data.purchaseLink, visible: data.visible, category: data.category, status: "AVAILABLE" });
        toast.success("Presente adicionado");
      }
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar presente");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteGift(id);
      toast.success("Presente removido");
    } catch {
      toast.error("Erro ao remover presente");
    }
  }

  async function handleSavePixConfig() {
    if (!pixKey.trim()) {
      toast.error("A chave Pix não pode ser vazia.");
      return;
    }
    setSavingConfig(true);
    try {
      await saveConfig({ pixKey: pixKey.trim(), receiverName: receiverName.trim() || undefined });
      toast.success("Chave Pix salva com sucesso!");
    } catch {
      toast.error("Erro ao salvar configuração Pix.");
    } finally {
      setSavingConfig(false);
    }
  }

  async function handleToggleStatus(id: string, current: "PENDENTE" | "CONFIRMADO") {
    try {
      await updateStatus(id, current === "PENDENTE" ? "CONFIRMADO" : "PENDENTE");
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif">Presentes</h1>
      </div>

      <Tabs defaultValue="lista">
        <TabsList className="mb-4">
          <TabsTrigger value="lista" className="flex items-center gap-2">
            <GiftIcon className="h-4 w-4" /> Lista
          </TabsTrigger>
          <TabsTrigger value="pix" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" /> Pix
          </TabsTrigger>
        </TabsList>

        {/* ---- Gift List Tab ---- */}
        <TabsContent value="lista">
          <div className="flex justify-end mb-4">
            <Button variant="outline" className="border-foreground/20" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" /> Novo Presente
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gifts.map((g) => (
              <GiftCard key={g.id} gift={g} onEdit={openEdit} onDelete={handleDelete} onToggleVisible={toggleVisible} />
            ))}
          </div>
          <GiftFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} onSave={handleSave} />
        </TabsContent>

        {/* ---- Pix Tab ---- */}
        <TabsContent value="pix" className="space-y-6">

          {/* Config */}
          <Card className="border border-border/50 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-sans font-medium uppercase tracking-wider text-muted-foreground">
                Configuração da Chave Pix
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pix-key-admin">Chave Pix</Label>
                <Input
                  id="pix-key-admin"
                  placeholder="Cole sua chave pix aqui para poder receber de seus convidados"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pix-receiver">Nome do Recebedor (opcional)</Label>
                <Input
                  id="pix-receiver"
                  placeholder="Ex: Guilherme e Noiva"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                />
              </div>
              <Button onClick={handleSavePixConfig} disabled={savingConfig}>
                {savingConfig ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</> : "Salvar"}
              </Button>
            </CardContent>
          </Card>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border border-border/50 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-sans font-normal uppercase tracking-wider text-muted-foreground">
                  Total Confirmado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-serif text-green-600">{formatCurrency(confirmedTotal)}</p>
              </CardContent>
            </Card>
            <Card className="border border-border/50 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-sans font-normal uppercase tracking-wider text-muted-foreground">
                  Total Pendente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-serif text-amber-500">{formatCurrency(pendingTotal)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Transactions */}
          <Card className="border border-border/50 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-sans font-medium uppercase tracking-wider text-muted-foreground">
                Pix Recebidos de Presente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Nenhuma transação registrada ainda.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground text-left">
                        <th className="pb-2 font-normal">Convidado</th>
                        <th className="pb-2 font-normal">Valor</th>
                        <th className="pb-2 font-normal">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t.id} className="border-b last:border-0">
                          <td className="py-3 font-medium">{t.invitationName}</td>
                          <td className="py-3">{formatCurrency(t.amount)}</td>
                          <td className="py-3">
                            <Select
                              value={t.status}
                              onValueChange={() => handleToggleStatus(t.id, t.status)}
                            >
                              <SelectTrigger
                                className={`w-36 text-xs h-8 ${t.status === "CONFIRMADO"
                                  ? "bg-success/20 text-success border-success/30"
                                  : "bg-warning/20 text-warning border-warning/30"
                                  }`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDENTE">Pendente</SelectItem>
                                <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
