import type { Gift } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, ExternalLink, Trash2 } from "lucide-react";

interface GiftCardProps {
    gift: Gift;
    onEdit: (gift: Gift) => void;
    onDelete: (id: string) => void;
    onToggleVisible: (id: string) => void;
}

export function GiftCard({ gift: g, onEdit, onDelete, onToggleVisible }: GiftCardProps) {
    return (
        <Card className={`border border-border/50 shadow-none overflow-hidden ${!g.visible ? "opacity-60" : ""}`}>
            {g.imageUrl && (
                <div className="aspect-[4/3] overflow-hidden relative bg-muted/20">
                    <img src={g.imageUrl} alt={g.name} className="w-full h-full object-contain" />
                    {g.status === "CHOSEN" && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Badge variant="secondary" className="text-sm font-medium">ESCOLHIDO</Badge>
                        </div>
                    )}
                </div>
            )}
            <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <h3 className="font-serif text-lg leading-tight">{g.name}</h3>
                        <Badge variant="outline" className="w-fit mt-1 text-[10px]">{g.category}</Badge>
                    </div>
                    {g.status === "AVAILABLE" ? (
                        <Badge variant="outline" className="text-[10px] ml-2 shrink-0">Livre</Badge>
                    ) : (
                        <Badge variant="secondary" className="text-[10px] ml-2 shrink-0">Escolhido</Badge>
                    )}
                </div>

                {g.status === "CHOSEN" && g.chosenByFamilyName && (
                    <p className="text-xs text-muted-foreground">
                        Escolhido por: <span className="font-medium">{g.chosenByFamilyName}</span>
                    </p>
                )}

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                        <Switch checked={g.visible} onCheckedChange={() => onToggleVisible(g.id)} />
                        <span className="text-xs text-muted-foreground">{g.visible ? "Visível" : "Oculto"}</span>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(g)}>
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(g.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        {g.purchaseLink && (
                            <Button variant="ghost" size="icon" asChild>
                                <a href={g.purchaseLink} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
