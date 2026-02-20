import { useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useRsvpBySlug } from "@/hooks/useRsvpBySlug";
import { Button } from "@/components/ui/button";
import { BotanicalAccent } from "@/components/BotanicalAccent";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { PublicGiftCard } from "@/components/PublicGiftCard";
import { GiftConfirmDialog } from "@/components/public/GiftConfirmDialog";

export default function PublicGifts() {
  const { slug } = useParams<{ slug: string }>();
  const { visibleGifts, chooseGift } = useApp();
  const { data: invitation, isLoading } = useRsvpBySlug(slug);

  const [choosingId, setChoosingId] = useState<string | null>(null);
  const [confirmGiftId, setConfirmGiftId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-serif text-xl">Convite não encontrado ou erro ao carregar.</p>
      </div>
    );
  }

  const hasConfirmed = invitation.people.some((p) => p.status === "confirmed");

  const displayedGifts = visibleGifts.filter((g) =>
    invitation.categories?.includes(g.category)
  );

  if (!hasConfirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <BotanicalAccent variant="leaf" className="w-12 mb-6 opacity-40" />
        <h1 className="font-serif text-2xl mb-3">Lista de Presentes</h1>
        <p className="text-muted-foreground">
          Confirme sua presença primeiro para acessar a lista de presentes.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => window.location.href = `/rsvp/${slug}`}>
          Ir para Confirmação
        </Button>
      </div>
    );
  }

  async function handleChoose(id: string) {
    setConfirmGiftId(null);
    setChoosingId(id);
    try {
      await chooseGift(id, slug);
      toast.success("Obrigado! O presente foi marcado como escolhido.");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível marcar o presente. Tente novamente.");
    } finally {
      setChoosingId(null);
    }
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <BotanicalAccent variant="branch" className="w-32 mx-auto mb-4 opacity-30" />
          <h1 className="font-serif text-3xl mb-2">Lista de Presentes</h1>
          <p className="text-muted-foreground">Escolha um presente especial para os noivos</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedGifts.map((g) => (
            <PublicGiftCard
              key={g.id}
              gift={g}
              isChoosing={choosingId === g.id}
              onChoose={(id) => setConfirmGiftId(id)}
            />
          ))}
        </div>

        <BotanicalAccent variant="branch" className="w-48 mx-auto mt-16 opacity-20" />
      </div>

      <GiftConfirmDialog
        open={!!confirmGiftId}
        isChoosing={!!choosingId}
        onConfirm={() => confirmGiftId && handleChoose(confirmGiftId)}
        onCancel={() => setConfirmGiftId(null)}
      />
    </div>
  );
}
