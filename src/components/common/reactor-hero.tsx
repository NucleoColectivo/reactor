'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const fullText = "SISTEMA_DE_ACTIVACIÓN_CREATIVA_CON_IA";

const heroBgImageIds = ['hero-bg-1', 'hero-bg-10', 'hero-bg-2', 'hero-bg-3', 'hero-bg-4', 'hero-bg-5', 'hero-bg-6', 'hero-bg-7', 'hero-bg-8', 'hero-bg-9', 'hero-bg-ar-reality', 'hero-bg-biology-science', 'hero-bg-cinema-film', 'hero-bg-cosmic-digital', 'hero-bg-cubism-paint', 'hero-bg-dance-flow', 'hero-bg-digital-symphony', 'hero-bg-lab-creative', 'hero-bg-literature-words', 'hero-bg-modernism-paint', 'hero-bg-music-symphony', 'hero-bg-neural-art', 'hero-bg-pencil-paint', 'hero-bg-photography-lens', 'hero-bg-popart-paint', 'hero-bg-sculpture-digital', 'hero-bg-synesthesia-senses', 'hero-bg-textile-weaving', 'hero-bg-theater-drama'];

export function ReactorHero() {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroBgImages = heroBgImageIds.map(id => PlaceHolderImages.find(p => p.id === id)).filter((img): img is NonNullable<typeof img> => !!img);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (displayedText.length < fullText.length) {
      timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, 25);
    } else if (isTyping) {
        timeout = setTimeout(() => setIsTyping(false), 1200);
    }
    return () => clearTimeout(timeout);
  }, [displayedText, isTyping]);
  
  useEffect(() => {
    if (heroBgImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % heroBgImages.length);
      }, 5000); // Change image every 5 seconds
      return () => clearInterval(interval);
    }
  }, [heroBgImages.length]);

  return (
    <section className="reactor-container">
      <div className="absolute inset-0 w-full h-full animate-zoom-in-out">
        {heroBgImages.map((image, index) => (
          <Image
              key={image.id}
              src={image.imageUrl}
              alt={image.description}
              fill
              className={cn(
                "object-cover transition-opacity duration-1000",
                index === currentImageIndex ? "opacity-20" : "opacity-0"
              )}
              data-ai-hint={image.imageHint}
              priority={index === 0}
            />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <h1 className="reactor-title">
            <span data-text="NÚCLEO">NÚCLEO</span>
            <span data-text="REACTOR">REACTOR</span>
        </h1>

        <div className="reactor-tag">
            <span className="bracket">[ </span>
            <span className="typed-text">{displayedText}</span>
            {isTyping && <span className="cursor">|</span>}
            <span className="bracket"> ]</span>
        </div>
        
        <p className="reactor-description">
          NÚCLEO REACTOR es un laboratorio digital de creación y pensamiento que utiliza la IA como un colaborador creativo. Un workspace para experimentar, prototipar y publicar proyectos que exploran las nuevas fronteras del arte, la cultura y la tecnología.
        </p>
      </div>
      <div className="relative z-10 pt-12 reactor-button">
          <Button asChild size="lg" className="font-mono text-lg px-12 py-8">
              <Link href="/courses">
                  [ ENTRAR_AL_WORKSPACE ]
              </Link>
          </Button>
      </div>
    </section>
  );
}
