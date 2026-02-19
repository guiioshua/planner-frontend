import { useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useRsvpBySlug } from "@/hooks/useRsvpBySlug";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BotanicalAccent } from "@/components/BotanicalAccent";
import { ExternalLink, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function PublicGifts() {
  const { slug } = useParams<{ slug: string }>();
  // We use visibleGifts from context (which fetches from API via useGifts hook)
  const { visibleGifts, chooseGift } = useApp();
  const { data: invitation, isLoading } = useRsvpBySlug(slug);

  const [choosingId, setChoosingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If fetching invitation fails or doesn't exist, we likely shouldn't show the gifts or at least prompt to RSVP?
  // PRD says: "Após o convidado confirmar presença ... o sistema deve exibir um botão ... Ver Lista de Presentes".
  // "Se o convidado acessar o link do convite novamente e já estiver confirmado, a lista deve estar visível imediatamente."

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
          {displayedGifts.map((g) => {
            const isChosen = g.status === "CHOSEN";
            return (
              <Card key={g.id} className={`border border-border/50 shadow-none overflow-hidden ${isChosen ? "opacity-75" : ""}`}>
                {g.imageUrl && (
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={g.imageUrl} alt={g.name} className="w-full h-full object-cover" />
                    {isChosen && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <Badge variant="secondary" className="text-sm font-medium shadow-md">ESCOLHIDO</Badge>
                      </div>
                    )}
                  </div>
                )}
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-serif text-lg leading-tight">{g.name}</h3>

                  <div className="flex flex-col gap-2 pt-2">
                    {g.purchaseLink && (
                      <Button variant="outline" className="w-full border-foreground/20" asChild>
                        <a href={g.purchaseLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" /> Ver na Loja
                        </a>
                      </Button>
                    )}

                    <Button
                      className={`w-full ${isChosen ? "bg-muted text-muted-foreground hover:bg-muted" : ""}`}
                      disabled={isChosen || choosingId === g.id}
                      onClick={() => handleChoose(g.id)}
                      variant={isChosen ? "ghost" : "default"}
                    >
                      {isChosen ? (
                        <><Check className="h-4 w-4 mr-2" /> Escolhido </>
                      ) : (
                        "Presentear"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <BotanicalAccent variant="branch" className="w-48 mx-auto mt-16 opacity-20" />
      </div>
    </div>
  );
}
