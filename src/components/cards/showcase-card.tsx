"use client";

import { useState, useEffect } from "react";
import type { ShowcaseItem } from "@/lib/data";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Cpu, Brush, Code, Bot, ExternalLink } from "lucide-react";
import Link from "next/link";

// A simple mapping for tool icons
function getToolIcon(tool: string) {
    const lowerTool = tool.toLowerCase();
    if (['artbreeder', 'midjourney', 'photoshop', 'canva', 'dall-e', 'ilustración digital', 'diseño'].some(t => lowerTool.includes(t))) {
        return <Brush className="h-3 w-3" />;
    }
    if (['p5.js', 'python', 'fine-tuning', 'code', 'after effects', 'processing', 'arduino', 'kinect', 'leaflet', 'raspberry pi', 'microscopio diy', 'next.js'].some(t => lowerTool.includes(t))) {
        return <Code className="h-3 w-3" />;
    }
    if (['runwayml', 'teachable machine', 'huggingface spaces', 'chatgpt', 'elevenlabs', 'audacity', 'llm', 'generative art', 'interactive art', 'generative ai', 'ableton live', 'paisaje sonoro', 'genkit', 'ai agent'].some(t => lowerTool.includes(t))) {
        return <Cpu className="h-3 w-3" />;
    }
    return <Bot className="h-3 w-3" />;
}

type ShowcaseCardProps = {
    item: ShowcaseItem;
}

export function ShowcaseCard({ item }: ShowcaseCardProps) {
    const images: ImagePlaceholder[] = (item.imageIds || (item.imageId ? [item.imageId] : []))
        .map(id => PlaceHolderImages.find(p => p.id === id))
        .filter((img): img is ImagePlaceholder => !!img);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
            }, 3000); // Change image every 3 seconds
            return () => clearInterval(interval);
        }
    }, [images.length]);

    const isFeatureList = /^[🚀🎵📷]/.test(item.description);

    return (
        <Link href={item.url} target="_blank" rel="noopener noreferrer" className="flex">
            <Card className="group flex flex-col w-full overflow-hidden transition-all duration-300 hover:border-primary/50">
                {images.length > 0 && (
                    <div className="aspect-square overflow-hidden relative scanline-overlay">
                         {images.map((image, index) => (
                            <Image
                                key={image.id}
                                alt={item.title}
                                fill
                                src={image.imageUrl}
                                className={`object-cover transition-opacity duration-1000 ease-in-out group-hover:scale-105 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                data-ai-hint={image.imageHint}
                            />
                        ))}
                    </div>
                )}
                <CardHeader>
                    <div className="flex-1">
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>por {item.author}</CardDescription>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"/>
                </CardHeader>
                <CardContent className="flex-grow">
                     {isFeatureList ? (
                        <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                            {item.description.split(/(?=[🚀🎵📷])/).map((part, index) => {
                                if (!part.trim()) return null;
                                const emoji = part.charAt(0);
                                const text = part.substring(1).trim().replace(/\.$/, '');
                                return (
                                    <li key={`${text}-${index}`} className="flex items-start gap-2">
                                        <span suppressHydrationWarning className="text-lg leading-tight pt-0.5">{emoji}</span>
                                        <span>{text}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground font-mono">{item.description}</p>
                    )}
                </CardContent>
                {item.tools && item.tools.length > 0 && (
                    <CardFooter className="flex flex-wrap gap-2 pt-4">
                        {item.tools.map(tool => (
                            <Badge key={tool} variant="secondary" className="gap-1.5 pl-2 rounded-none font-mono text-xs">
                                {getToolIcon(tool)}
                                {tool}
                            </Badge>
                        ))}
                    </CardFooter>
                )}
            </Card>
        </Link>
    );
}
