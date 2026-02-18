import { useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BotanicalAccent } from "@/components/BotanicalAccent";
import { ExternalLink } from "lucide-react";

export default function PublicGifts() {
  const { slug } = useParams<{ slug: string }>();
  const { getBySlug, activeGifts } = useApp();
  const invitation = getBySlug(slug || "");

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-serif text-xl">Página não encontrada.</p>
      </div>
    );
  }

  const hasConfirmed = invitation.people.some((p) => p.status === "confirmed");

  if (!hasConfirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <BotanicalAccent variant="leaf" className="w-12 mb-6 opacity-40" />
        <h1 className="font-serif text-2xl mb-3">Lista de Presentes</h1>
        <p className="text-muted-foreground">
          Confirme sua presença primeiro para acessar a lista de presentes.
        </p>
      </div>
    );
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
          {activeGifts.map((g) => (
            <Card key={g.id} className="border border-border/50 shadow-none overflow-hidden">
              {g.imageUrl && (
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={g.imageUrl} alt={g.name} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-4 space-y-3">
                <h3 className="font-serif text-lg">{g.name}</h3>
                {g.purchaseUrl && (
                  <Button variant="outline" className="w-full border-foreground/20" asChild>
                    <a href={g.purchaseUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" /> Comprar
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <BotanicalAccent variant="branch" className="w-48 mx-auto mt-16 opacity-20" />
      </div>
    </div>
  );
}
