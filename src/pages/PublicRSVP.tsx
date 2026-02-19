import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRsvpBySlug } from "@/hooks/useRsvpBySlug";
import { useApp } from "@/context/AppContext";
import { RSVPStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BotanicalAccent } from "@/components/BotanicalAccent";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Gift, Loader2, RotateCcw, ZoomIn, ZoomOut, RefreshCcw, X as CloseIcon } from "lucide-react";
import { toast } from "sonner";

export default function PublicRSVP() {
  const { slug } = useParams<{ slug: string }>();
  const { confirmRSVP } = useApp();
  const { data: invitation, isLoading, error } = useRsvpBySlug(slug);
  const navigate = useNavigate();

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

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <BotanicalAccent variant="leaf" className="w-12 mb-6 opacity-40" />
        <h1 className="font-serif text-3xl mb-3">Obrigado!</h1>
        <p className="text-muted-foreground mb-8">Sua confirmação foi registrada com sucesso.</p>
        <Button variant="outline" className="border-foreground/20 mb-3" onClick={() => navigate(`/gifts/${slug}`)}>
          <Gift className="h-4 w-4 mr-2" /> Ver Lista de Presentes
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setSubmitted(false)}>
          <RotateCcw className="h-3.5 w-3.5 mr-2" /> Alterar Confirmação
        </Button>
        <BotanicalAccent variant="branch" className="w-40 mt-12 opacity-20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-6">
      <BotanicalAccent variant="corner" className="w-16 mb-6 opacity-30 self-start" />

      {invitation.coverImageUrl && (
        <Dialog>
          <DialogTrigger asChild>
            <div className="w-full max-w-lg flex items-center justify-center cursor-zoom-in relative group mb-8 bg-muted/5 rounded-sm p-1">
              <img
                src={invitation.coverImageUrl}
                alt="Capa do convite"
                className="max-w-full max-h-[60vh] h-auto w-auto rounded-sm shadow-md border border-border/10 transition-all group-hover:brightness-95"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 rounded-sm">
                <div className="bg-white/90 p-2 rounded-full shadow-lg">
                  <ZoomIn className="h-5 w-5 text-foreground" />
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[100vw] w-full h-[100vh] p-0 border-none bg-black/95 shadow-none flex flex-col items-center justify-center">
            <TransformWrapper
              initialScale={1}
              initialPositionX={0}
              initialPositionY={0}
              centerOnInit
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <div className="absolute top-4 right-14 z-[60] flex gap-2">
                    <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border-white/10 text-white" onClick={() => zoomIn()}>
                      <ZoomIn className="h-5 w-5" />
                    </Button>
                    <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border-white/10 text-white" onClick={() => zoomOut()}>
                      <ZoomOut className="h-5 w-5" />
                    </Button>
                    <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border-white/10 text-white" onClick={() => resetTransform()}>
                      <RefreshCcw className="h-5 w-5" />
                    </Button>
                  </div>

                  <TransformComponent
                    wrapperStyle={{ width: "100%", height: "100%" }}
                    contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <img
                        src={invitation.coverImageUrl}
                        alt="Capa do convite tela cheia"
                        className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing"
                      />
                    </div>
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </DialogContent>
        </Dialog>
      )}

      <h1 className="font-serif text-3xl mb-2 text-center">{invitation.familyName}</h1>
      <p className="text-muted-foreground text-center max-w-md mb-10 leading-relaxed">{invitation.message}</p>

      <div className="w-full max-w-md space-y-4 mb-10">
        <h2 className="font-serif text-lg mb-2">Confirme a presença</h2>
        {invitation.people.map((p) => {
          const isConfirmed = (statuses[p.id] ?? p.status) === "confirmed";

          return (
            <div key={p.id} className="flex items-center justify-between border border-border/50 rounded-sm p-4">
              <span className="font-medium">{p.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {isConfirmed ? "Vou" : "Não vou"}
                </span>
                <Switch
                  checked={isConfirmed}
                  onCheckedChange={(checked) => handleToggle(p.id, checked)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Button onClick={handleSubmit} className="px-10" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Confirmar
      </Button>

      <BotanicalAccent variant="branch" className="w-48 mt-16 opacity-20" />
    </div>
  );
}
