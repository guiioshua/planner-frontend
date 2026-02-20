import { Button } from "@/components/ui/button";
import { BotanicalAccent } from "@/components/BotanicalAccent";
import { Gift, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RSVPSuccessScreenProps {
    slug: string;
    onEdit: () => void;
}

export function RSVPSuccessScreen({ slug, onEdit }: RSVPSuccessScreenProps) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
            <BotanicalAccent variant="leaf" className="w-12 mb-6 opacity-40" />
            <h1 className="font-serif text-3xl mb-3">Obrigado!</h1>
            <p className="text-muted-foreground mb-8">Sua confirmação foi registrada com sucesso.</p>
            <Button variant="outline" className="border-foreground/20 mb-3" onClick={() => navigate(`/gifts/${slug}`)}>
                <Gift className="h-4 w-4 mr-2" /> Ver Lista de Presentes
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={onEdit}>
                <RotateCcw className="h-3.5 w-3.5 mr-2" /> Alterar Confirmação
            </Button>
            <BotanicalAccent variant="branch" className="w-40 mt-12 opacity-20" />
        </div>
    );
}
