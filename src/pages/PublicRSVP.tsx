import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { RSVPStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BotanicalAccent } from "@/components/BotanicalAccent";
import { Gift } from "lucide-react";

export default function PublicRSVP() {
  const { slug } = useParams<{ slug: string }>();
  const { getBySlug, confirmRSVP } = useApp();
  const navigate = useNavigate();
  const invitation = getBySlug(slug || "");

  const [statuses, setStatuses] = useState<Record<string, RSVPStatus>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-serif text-xl">Convite não encontrado.</p>
      </div>
    );
  }

  const allConfirmedOrDeclined = invitation.people.every((p) => p.status !== "pending");

  function handleToggle(personId: string, confirmed: boolean) {
    setStatuses((prev) => ({ ...prev, [personId]: confirmed ? "confirmed" : "declined" }));
  }

  function handleSubmit() {
    confirmRSVP(slug!, statuses);
    setSubmitted(true);
  }

  if (submitted || allConfirmedOrDeclined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <BotanicalAccent variant="leaf" className="w-12 mb-6 opacity-40" />
        <h1 className="font-serif text-3xl mb-3">Obrigado!</h1>
        <p className="text-muted-foreground mb-8">Sua confirmação foi registrada com sucesso.</p>
        <Button variant="outline" className="border-foreground/20" onClick={() => navigate(`/gifts/${slug}`)}>
          <Gift className="h-4 w-4 mr-2" /> Ver Lista de Presentes
        </Button>
        <BotanicalAccent variant="branch" className="w-40 mt-12 opacity-20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-6">
      <BotanicalAccent variant="corner" className="w-16 mb-6 opacity-30 self-start" />

      {invitation.coverImageUrl && (
        <div className="w-full max-w-lg aspect-[16/9] rounded-sm overflow-hidden mb-8">
          <img src={invitation.coverImageUrl} alt="Capa do convite" className="w-full h-full object-cover" />
        </div>
      )}

      <h1 className="font-serif text-3xl mb-2 text-center">{invitation.familyName}</h1>
      <p className="text-muted-foreground text-center max-w-md mb-10 leading-relaxed">{invitation.message}</p>

      <div className="w-full max-w-md space-y-4 mb-10">
        <h2 className="font-serif text-lg mb-2">Confirme a presença</h2>
        {invitation.people.map((p) => (
          <div key={p.id} className="flex items-center justify-between border border-border/50 rounded-sm p-4">
            <span className="font-medium">{p.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {statuses[p.id] === "confirmed" ? "Confirmado" : statuses[p.id] === "declined" ? "Recusado" : "Pendente"}
              </span>
              <Switch
                checked={statuses[p.id] === "confirmed"}
                onCheckedChange={(checked) => handleToggle(p.id, checked)}
              />
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleSubmit} className="px-10">
        Confirmar
      </Button>

      <BotanicalAccent variant="branch" className="w-48 mt-16 opacity-20" />
    </div>
  );
}
