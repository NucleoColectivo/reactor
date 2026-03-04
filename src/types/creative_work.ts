export interface CreativeProject {
  id: string;
  userId: string;
  title: string;
  routeId?: string;
  description?: string;
  status: "en_proceso" | "completado";
  outputs?: {
    text?: string;
    media?: string[];
  };
  createdAt: string; // ISO String
}

export interface Progress {
    id: string;
    userId: string;
    routeId: string;
    completedModules: string[];
    completedExercises: string[];
    updatedAt: string; // ISO String
}
