import { CreateExperimentForm } from '@/components/play/create-experiment-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CreateExperimentPage() {
  return (
    <div className="container py-12 md:py-24">
        <div className="mb-8">
            <Button asChild variant="ghost">
                <Link href="/play">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a KINEFONÍA
                </Link>
            </Button>
        </div>
      <CreateExperimentForm />
    </div>
  );
}
