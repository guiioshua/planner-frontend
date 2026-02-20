import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRsvpBySlug } from "@/hooks/useRsvpBySlug";
import { useApp } from "@/context/AppContext";
import { RSVPStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { BotanicalAccent } from "@/components/BotanicalAccent";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { CoverImageViewer } from "@/components/public/CoverImageViewer";
import { RSVPPersonRow } from "@/components/public/RSVPPersonRow";
import { RSVPSuccessScreen } from "@/components/public/RSVPSuccessScreen";
import { AddGuestForm } from "@/components/public/AddGuestForm";

export default function PublicRSVP() {
  const { slug } = useParams<{ slug: string }>();
  const { confirmRSVP } = useApp();
  const { data: invitation, isLoading, error } = useRsvpBySlug(slug);
  const queryClient = useQueryClient();

  const [statuses, setStatuses] = useState<Record<string, RSVPStatus>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-populate switches with saved DB values so returning guests see their prior answers
  useEffect(() => {
    if (invitation) {
      const initial: Record<string, RSVPStatus> = {};
      invitation.people.forEach((p) => {
        initial[p.id] = p.status;
      });
      setStatuses(initial);
    }
  }, [invitation?.id]); // run once when the invitation is first loaded

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-serif text-xl">Convite não encontrado.</p>
      </div>
    );
  }

  function handleToggle(personId: string, confirmed: boolean) {
    setStatuses((prev) => ({ ...prev, [personId]: confirmed ? "confirmed" : "declined" }));
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await confirmRSVP(slug!, statuses);
      setSubmitted(true);
      toast.success("Presença confirmada!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao confirmar presença");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGuestAdded() {
    queryClient.invalidateQueries({ queryKey: ["invitation", slug] });
  }

  if (submitted) {
    return <RSVPSuccessScreen slug={slug!} onEdit={() => setSubmitted(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-6">
      <BotanicalAccent variant="corner" className="w-16 mb-6 opacity-30 self-start" />

      {invitation.coverImageUrl && (
        <CoverImageViewer imageUrl={invitation.coverImageUrl} />
      )}

      <h1 className="font-serif text-3xl mb-2 text-center">{invitation.familyName}</h1>
      <p className="text-muted-foreground text-center max-w-md mb-10 leading-relaxed">
        {invitation.familyName}, temos um convite especial para você 💌
      </p>

      <div className="w-full max-w-md space-y-4 mb-10">
        <h2 className="font-serif text-lg mb-2">Confirme a presença</h2>
        {invitation.people.map((p) => (
          <RSVPPersonRow
            key={p.id}
            person={p}
            isConfirmed={(statuses[p.id] ?? p.status) === "confirmed"}
            onToggle={handleToggle}
          />
        ))}

        <div className="pt-4 border-t border-border/10">
          <p className="text-sm text-muted-foreground mb-3">Se alguém faltou, adicione o nome:</p>
          <AddGuestForm slug={slug!} onAdded={handleGuestAdded} />
        </div>
      </div>

      <Button onClick={handleSubmit} className="px-10" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Confirmar
      </Button>

      <BotanicalAccent variant="branch" className="w-48 mt-16 opacity-20" />
    </div>
  );
}
