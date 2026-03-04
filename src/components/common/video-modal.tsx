'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

type VideoModalProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    videoId: string | null;
    title: string | null;
};

export function VideoModal({ isOpen, setIsOpen, videoId, title }: VideoModalProps) {
    if (!videoId) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-4xl h-auto p-0 border-0 bg-black">
                <DialogTitle className="sr-only">{title || 'Video'}</DialogTitle>
                <div className="aspect-video">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title={title || "YouTube video player"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
            </DialogContent>
        </Dialog>
    );
}
