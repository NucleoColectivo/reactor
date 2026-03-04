import type { Resource } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "../ui/badge";

type ResourceCardProps = {
    resource: Resource;
};

export function ResourceCard({ resource }: ResourceCardProps) {
    const image = PlaceHolderImages.find(p => p.id === resource.imageId);

    return (
        <Card className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
            {image && (
                 <div className="aspect-video overflow-hidden">
                    <Image
                        alt={resource.title}
                        className="object-cover w-full h-full"
                        height={250}
                        src={image.imageUrl}
                        width={400}
                        data-ai-hint={image.imageHint}
                    />
                </div>
            )}
            <CardHeader>
                <CardTitle>{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                 <Badge variant="secondary">{resource.category}</Badge>
            </CardContent>
            <CardFooter>
                <Button asChild variant="secondary" className="w-full">
                    <Link href={resource.url} target="_blank" rel="noreferrer">
                        Visitar
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
