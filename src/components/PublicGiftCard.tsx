import type { Gift } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, Check } from "lucide-react";

interface PublicGiftCardProps {
    gift: Gift;
    isChoosing: boolean;
    onChoose: (id: string) => void;
}

export function PublicGiftCard({ gift: g, isChoosing, onChoose }: PublicGiftCardProps) {
    const isChosen = g.status === "CHOSEN";

    return (
        <Card className={`border border-border/50 shadow-none overflow-hidden ${isChosen ? "opacity-75" : ""}`}>
            {g.imageUrl && (
                <div className="aspect-[4/3] overflow-hidden relative bg-muted/20">
                    <img src={g.imageUrl} alt={g.name} className="w-full h-full object-contain" />
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
                        disabled={isChosen || isChoosing}
                        onClick={() => onChoose(g.id)}
                        variant={isChosen ? "ghost" : "default"}
                    >
                        {isChosen ? (
                            <><Check className="h-4 w-4 mr-2" /> Escolhido </>
                        ) : isChoosing ? (
                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Aguarde...</>
                        ) : (
                            "Escolher esse Presente"
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
