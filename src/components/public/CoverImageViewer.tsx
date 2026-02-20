import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, RefreshCcw, X as CloseIcon } from "lucide-react";

interface CoverImageViewerProps {
    imageUrl: string;
}

export function CoverImageViewer({ imageUrl }: CoverImageViewerProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="w-full max-w-lg flex items-center justify-center cursor-zoom-in relative group mb-8 bg-muted/5 rounded-sm p-1">
                    <img
                        src={imageUrl}
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
                            {/* Background layer click-to-close */}
                            <DialogClose className="absolute inset-0 z-0 bg-transparent cursor-default" />

                            <div className="absolute top-4 right-4 z-[70] flex gap-2">
                                <div className="flex gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-white/20 text-white" onClick={() => zoomIn()}>
                                        <ZoomIn className="h-5 w-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-white/20 text-white" onClick={() => zoomOut()}>
                                        <ZoomOut className="h-5 w-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-white/20 text-white" onClick={() => resetTransform()}>
                                        <RefreshCcw className="h-5 w-5" />
                                    </Button>
                                    <div className="w-px h-6 bg-white/20 self-center mx-1" />
                                    <DialogClose asChild>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-white/20 text-white">
                                            <CloseIcon className="h-5 w-5" />
                                        </Button>
                                    </DialogClose>
                                </div>
                            </div>

                            <TransformComponent
                                wrapperStyle={{ width: "100%", height: "100%", position: "relative", zIndex: 10 }}
                                contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                <div className="w-full h-full flex items-center justify-center p-4">
                                    <img
                                        src={imageUrl}
                                        alt="Capa do convite tela cheia"
                                        className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing shadow-2xl"
                                    />
                                </div>
                            </TransformComponent>
                        </>
                    )}
                </TransformWrapper>
            </DialogContent>
        </Dialog>
    );
}
