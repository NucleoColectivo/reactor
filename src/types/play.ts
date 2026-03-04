export interface PlayExperiment {
  id: string;
  title: string;
  type: 'juego' | 'interaccion' | 'videoarte' | 'instalacion_simulada';
  status: 'prototipo' | 'publicado' | 'archivado';
  authorId: string;
  description: string;
  tools?: string[];
  concept?: string;
  build_url?: string;
  template?: 'malla-sonica' | 'tejido-audiovisual' | 'vigilia';
  embed_type?: 'iframe' | 'canvas';
  tags?: string[];
  iterations: number;
  publishable: boolean;
  createdAt: string; // ISO String
}

export interface PlayIteration {
  id: string;
  experimentId: string;
  version: string;
  changes: string;
  feedback?: string;
  build_url?: string;
  createdAt: string; // ISO String
}

    
