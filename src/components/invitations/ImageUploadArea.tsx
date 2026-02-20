import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Image as ImageIcon } from "lucide-react";

interface ImageUploadAreaProps {
    previewUrl: string;
    onFileChange: (file: File) => void;
    onClear: () => void;
}

export function ImageUploadArea({ previewUrl, onFileChange, onClear }: ImageUploadAreaProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            onFileChange(e.target.files[0]);
        }
    }

    return (
        <div>
            <Label>Imagem de Capa</Label>
            <div
                className="mt-1 border-2 border-dashed border-border/50 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {previewUrl ? (
                    <div className="relative w-full aspect-video rounded overflow-hidden mb-2">
                        <img src={previewUrl} alt="Capa" className="w-full h-full object-cover" />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear();
                            }}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-4 text-muted-foreground">
                        <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                        <p className="text-sm">Clique para upload ou Ctrl+V</p>
                    </div>
                )}
            </div>
        </div>
    );
}
