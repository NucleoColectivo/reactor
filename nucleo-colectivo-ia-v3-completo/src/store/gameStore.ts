import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Types for the complete game store
export interface UserProfile {
  id: string;
  name: string;
  avatar: Avatar;
  level: number;
  neurotokens: number;
  totalScore: number;
  collaborationScore: number;
  creativityScore: number;
  ethicsScore: number;
  socialImpactPoints: number;
  joinedAt: Date;
  lastActive: Date;
  preferences: UserPreferences;
}

export interface Avatar {
  skin: string;
  hair: string;
  eyes: string;
  clothing: string;
  accessories: string[];
  culturalElements: string[];
  accessibilityFeatures: string[];
  expressions: Record<string, string>;
}

export interface UserPreferences {
  audioEnabled: boolean;
  audioVolume: number;
  narrationEnabled: boolean;
  narrationLanguage: 'es-CO' | 'es-ES' | 'es-MX';
  voiceSpeed: number;
  accessibilityMode: boolean;
  highContrastMode: boolean;
  reducedMotion: boolean;
  subtitlesEnabled: boolean;
  collaborationMode: 'open' | 'friends' | 'private';
}

export interface ModuleProgress {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  completed: boolean;
  score: number;
  maxScore: number;
  timeSpent: number;
  achievements: string[];
  startedAt?: Date;
  completedAt?: Date;
  collaborativeSession?: string;
  creations: Creation[];
  decisions: EthicalDecision[];
}

export interface Creation {
  id: string;
  type: 'art' | 'music' | 'neural_network' | 'chatbot' | 'story';
  title: string;
  description: string;
  data: any; // Stores the actual creation data
  thumbnail: string;
  likes: number;
  remixes: number;
  tags: string[];
  isPublic: boolean;
  collaborators: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EthicalDecision {
  scenarioId: string;
  choice: string;
  reasoning: string;
  impact: 'positive' | 'negative' | 'neutral';
  socialScore: number;
  timestamp: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'technical' | 'creative' | 'collaborative' | 'ethical' | 'local';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
  progress?: number;
  maxProgress?: number;
}

export interface CollaborationSession {
  id: string;
  name: string;
  type: 'study_group' | 'creative_lab' | 'ethics_debate' | 'neural_build';
  participants: UserProfile[];
  maxParticipants: number;
  currentModule: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  status: 'active' | 'paused' | 'completed';
  sharedState: any;
}

export interface GameState {
  // User Profile
  userProfile: UserProfile;
  
  // Progress tracking
  currentModule: number;
  moduleProgress: ModuleProgress[];
  totalScore: number;
  achievements: Achievement[];
  
  // Game flow
  gameStarted: boolean;
  gameCompleted: boolean;
  startTime: number;
  
  // Collaboration
  collaborationSession?: CollaborationSession;
  isCollaborating: boolean;
  connectedPeers: string[];
  
  // Gallery & Community
  communityCreations: Creation[];
  followedUsers: string[];
  
  // Real-time features
  currentNarration?: string;
  isNarrating: boolean;
  backgroundMusic: string;
  
  // PWA state
  isInstalled: boolean;
  updateAvailable: boolean;
  
  // Medellín specific content
  medellinProjects: MedellinProject[];
  ethicsDatabase: EthicsCase[];
}

export interface MedellinProject {
  id: string;
  name: string;
  organization: string;
  description: string;
  aiTechnology: string[];
  socialImpact: string;
  status: 'active' | 'completed' | 'planned';
  participants: number;
  website?: string;
  images: string[];
}

export interface EthicsCase {
  id: string;
  title: string;
  scenario: string;
  context: 'medellin' | 'colombia' | 'global';
  stakeholders: string[];
  options: EthicsOption[];
  realOutcome?: string;
  discussionPoints: string[];
}

export interface EthicsOption {
  id: string;
  text: string;
  consequences: string[];
  ethicalPrinciples: string[];
  socialImpact: 'high' | 'medium' | 'low';
  technicalFeasibility: 'high' | 'medium' | 'low';
}

// Initial state
const initialModules: ModuleProgress[] = [
  {
    id: 'fundamentals',
    name: 'Fundamentos de IA Interactivos',
    description: 'Laboratorio completo de tipos de IA con simulaciones reales',
    icon: '🧠',
    difficulty: 'beginner',
    estimatedTime: 25,
    completed: false,
    score: 0,
    maxScore: 500,
    timeSpent: 0,
    achievements: [],
    creations: [],
    decisions: []
  },
  {
    id: 'conversational',
    name: 'IA Conversacional Avanzada',
    description: 'Constructor de chatbots y simulador NLP real',
    icon: '💬',
    difficulty: 'intermediate',
    estimatedTime: 30,
    completed: false,
    score: 0,
    maxScore: 600,
    timeSpent: 0,
    achievements: [],
    creations: [],
    decisions: []
  },
  {
    id: 'computer-vision',
    name: 'Visión por Computadora Creativa',
    description: 'Detector de objetos real y analizador de arte',
    icon: '👁️',
    difficulty: 'intermediate',
    estimatedTime: 30,
    completed: false,
    score: 0,
    maxScore: 600,
    timeSpent: 0,
    achievements: [],
    creations: [],
    decisions: []
  },
  {
    id: 'generative',
    name: 'IA Generativa Multimodal',
    description: 'Estudio completo con 8 algoritmos generativos',
    icon: '🎨',
    difficulty: 'advanced',
    estimatedTime: 35,
    completed: false,
    score: 0,
    maxScore: 700,
    timeSpent: 0,
    achievements: [],
    creations: [],
    decisions: []
  },
  {
    id: 'neural-networks',
    name: 'Redes Neuronales 3D',
    description: 'Constructor inmersivo con Three.js y arquitecturas famosas',
    icon: '🕸️',
    difficulty: 'advanced',
    estimatedTime: 30,
    completed: false,
    score: 0,
    maxScore: 600,
    timeSpent: 0,
    achievements: [],
    creations: [],
    decisions: []
  },
  {
    id: 'ethics',
    name: 'Ética IA - Casos Reales Medellín',
    description: 'Simulador de decisiones urbanas y debates colaborativos',
    icon: '⚖️',
    difficulty: 'advanced',
    estimatedTime: 25,
    completed: false,
    score: 0,
    maxScore: 500,
    timeSpent: 0,
    achievements: [],
    creations: [],
    decisions: []
  }
];

const defaultAvatar: Avatar = {
  skin: 'medium',
  hair: 'curly-black',
  eyes: 'brown',
  clothing: 'casual-modern',
  accessories: [],
  culturalElements: ['colombia-flag-pin'],
  accessibilityFeatures: [],
  expressions: {
    default: 'friendly',
    happy: 'bright-smile',
    focused: 'concentrated',
    surprised: 'wide-eyes',
    thoughtful: 'chin-rest'
  }
};

const defaultPreferences: UserPreferences = {
  audioEnabled: true,
  audioVolume: 0.7,
  narrationEnabled: true,
  narrationLanguage: 'es-CO',
  voiceSpeed: 1.0,
  accessibilityMode: false,
  highContrastMode: false,
  reducedMotion: false,
  subtitlesEnabled: false,
  collaborationMode: 'open'
};

const initialState: GameState = {
  userProfile: {
    id: crypto.randomUUID(),
    name: '',
    avatar: defaultAvatar,
    level: 1,
    neurotokens: 100,
    totalScore: 0,
    collaborationScore: 0,
    creativityScore: 0,
    ethicsScore: 0,
    socialImpactPoints: 0,
    joinedAt: new Date(),
    lastActive: new Date(),
    preferences: defaultPreferences
  },
  currentModule: 0,
  moduleProgress: initialModules,
  totalScore: 0,
  achievements: [],
  gameStarted: false,
  gameCompleted: false,
  startTime: 0,
  isCollaborating: false,
  connectedPeers: [],
  communityCreations: [],
  followedUsers: [],
  isNarrating: false,
  backgroundMusic: 'ambient',
  isInstalled: false,
  updateAvailable: false,
  medellinProjects: [],
  ethicsDatabase: []
};

interface GameStore extends GameState {
  // User actions
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateAvatar: (avatar: Partial<Avatar>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Game flow
  startGame: () => void;
  completeModule: (moduleId: string, score: number, achievements?: string[], creations?: Creation[], decisions?: EthicalDecision[]) => void;
  setCurrentModule: (moduleIndex: number) => void;
  resetGame: () => void;
  
  // Achievements & gamification
  addAchievement: (achievement: Achievement) => void;
  addNeurotokens: (amount: number, reason: string) => void;
  spendNeurotokens: (amount: number, item: string) => boolean;
  
  // Collaboration
  startCollaboration: (session: CollaborationSession) => void;
  joinCollaboration: (sessionId: string) => void;
  leaveCollaboration: () => void;
  updateCollaborationState: (state: any) => void;
  addPeer: (peerId: string) => void;
  removePeer: (peerId: string) => void;
  
  // Community & creations
  addCreation: (creation: Creation) => void;
  updateCreation: (creationId: string, updates: Partial<Creation>) => void;
  likeCreation: (creationId: string) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  
  // Audio & narration
  startNarration: (text: string) => void;
  stopNarration: () => void;
  setBackgroundMusic: (track: string) => void;
  
  // PWA
  setInstalled: (installed: boolean) => void;
  setUpdateAvailable: (available: boolean) => void;
  
  // Medellín content
  loadMedellinProjects: (projects: MedellinProject[]) => void;
  loadEthicsDatabase: (cases: EthicsCase[]) => void;
  
  // Analytics & progress
  getTotalPlayTime: () => number;
  getCompletionPercentage: () => number;
  getUserLevel: () => string;
  getCreationsByType: (type: string) => Creation[];
  getEthicalDecisionStats: () => any;
  getSocialImpactScore: () => number;
}

export const useGameStore = create<GameStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,
      
      updateUserProfile: (profile) => set((state) => {
        Object.assign(state.userProfile, profile);
        state.userProfile.lastActive = new Date();
      }),
      
      updateAvatar: (avatar) => set((state) => {
        Object.assign(state.userProfile.avatar, avatar);
      }),
      
      updatePreferences: (preferences) => set((state) => {
        Object.assign(state.userProfile.preferences, preferences);
      }),
      
      startGame: () => set((state) => {
        state.gameStarted = true;
        state.startTime = Date.now();
      }),
      
      completeModule: (moduleId, score, achievements = [], creations = [], decisions = []) => set((state) => {
        const moduleIndex = state.moduleProgress.findIndex(m => m.id === moduleId);
        if (moduleIndex === -1) return;
        
        const module = state.moduleProgress[moduleIndex];
        module.completed = true;
        module.score = Math.max(module.score, score);
        module.completedAt = new Date();
        module.achievements = [...new Set([...module.achievements, ...achievements])];
        module.creations.push(...creations);
        module.decisions.push(...decisions);
        
        // Update user profile scores
        state.userProfile.totalScore += score;
        state.userProfile.creativityScore += creations.length * 10;
        state.userProfile.ethicsScore += decisions.length * 5;
        
        // Calculate level
        const completedModules = state.moduleProgress.filter(m => m.completed).length;
        state.userProfile.level = Math.floor(completedModules / 2) + 1;
        
        // Check if game is complete
        state.gameCompleted = completedModules === state.moduleProgress.length;
        
        // Award neurotokens
        const tokensEarned = Math.floor(score / 10) + achievements.length * 50 + creations.length * 25;
        state.userProfile.neurotokens += tokensEarned;
      }),
      
      setCurrentModule: (moduleIndex) => set((state) => {
        state.currentModule = moduleIndex;
        const module = state.moduleProgress[moduleIndex];
        if (module && !module.startedAt) {
          module.startedAt = new Date();
        }
      }),
      
      resetGame: () => set(() => ({
        ...initialState,
        userProfile: {
          ...initialState.userProfile,
          id: crypto.randomUUID(),
          name: get().userProfile.name // Keep the user's name
        }
      })),
      
      addAchievement: (achievement) => set((state) => {
        const exists = state.achievements.find(a => a.id === achievement.id);
        if (!exists) {
          state.achievements.push(achievement);
          
          // Award neurotokens based on rarity
          const tokenReward = {
            'common': 25,
            'rare': 50,
            'epic': 100,
            'legendary': 250
          }[achievement.rarity];
          
          state.userProfile.neurotokens += tokenReward;
        }
      }),
      
      addNeurotokens: (amount, reason) => set((state) => {
        state.userProfile.neurotokens += amount;
        // Could track the reason for analytics
      }),
      
      spendNeurotokens: (amount, item) => {
        const state = get();
        if (state.userProfile.neurotokens >= amount) {
          set((state) => {
            state.userProfile.neurotokens -= amount;
          });
          return true;
        }
        return false;
      },
      
      startCollaboration: (session) => set((state) => {
        state.collaborationSession = session;
        state.isCollaborating = true;
      }),
      
      joinCollaboration: (sessionId) => set((state) => {
        // Implementation would involve WebRTC connection
        state.isCollaborating = true;
      }),
      
      leaveCollaboration: () => set((state) => {
        state.collaborationSession = undefined;
        state.isCollaborating = false;
        state.connectedPeers = [];
      }),
      
      updateCollaborationState: (collaborationState) => set((state) => {
        if (state.collaborationSession) {
          state.collaborationSession.sharedState = collaborationState;
        }
      }),
      
      addPeer: (peerId) => set((state) => {
        if (!state.connectedPeers.includes(peerId)) {
          state.connectedPeers.push(peerId);
        }
      }),
      
      removePeer: (peerId) => set((state) => {
        state.connectedPeers = state.connectedPeers.filter(id => id !== peerId);
      }),
      
      addCreation: (creation) => set((state) => {
        const currentModule = state.moduleProgress[state.currentModule];
        if (currentModule) {
          currentModule.creations.push(creation);
        }
        if (creation.isPublic) {
          state.communityCreations.push(creation);
        }
      }),
      
      updateCreation: (creationId, updates) => set((state) => {
        // Update in current module
        const currentModule = state.moduleProgress[state.currentModule];
        if (currentModule) {
          const creation = currentModule.creations.find(c => c.id === creationId);
          if (creation) {
            Object.assign(creation, updates);
          }
        }
        
        // Update in community
        const communityCreation = state.communityCreations.find(c => c.id === creationId);
        if (communityCreation) {
          Object.assign(communityCreation, updates);
        }
      }),
      
      likeCreation: (creationId) => set((state) => {
        const creation = state.communityCreations.find(c => c.id === creationId);
        if (creation) {
          creation.likes += 1;
        }
      }),
      
      followUser: (userId) => set((state) => {
        if (!state.followedUsers.includes(userId)) {
          state.followedUsers.push(userId);
        }
      }),
      
      unfollowUser: (userId) => set((state) => {
        state.followedUsers = state.followedUsers.filter(id => id !== userId);
      }),
      
      startNarration: (text) => set((state) => {
        state.currentNarration = text;
        state.isNarrating = true;
      }),
      
      stopNarration: () => set((state) => {
        state.currentNarration = undefined;
        state.isNarrating = false;
      }),
      
      setBackgroundMusic: (track) => set((state) => {
        state.backgroundMusic = track;
      }),
      
      setInstalled: (installed) => set((state) => {
        state.isInstalled = installed;
      }),
      
      setUpdateAvailable: (available) => set((state) => {
        state.updateAvailable = available;
      }),
      
      loadMedellinProjects: (projects) => set((state) => {
        state.medellinProjects = projects;
      }),
      
      loadEthicsDatabase: (cases) => set((state) => {
        state.ethicsDatabase = cases;
      }),
      
      getTotalPlayTime: () => {
        const state = get();
        if (!state.gameStarted) return 0;
        return Date.now() - state.startTime;
      },
      
      getCompletionPercentage: () => {
        const state = get();
        const completedModules = state.moduleProgress.filter(m => m.completed).length;
        return (completedModules / state.moduleProgress.length) * 100;
      },
      
      getUserLevel: () => {
        const state = get();
        const level = state.userProfile.level;
        if (level === 1) return 'Explorador de IA';
        if (level === 2) return 'Aprendiz Colaborativo';
        if (level === 3) return 'Creador Consciente';
        if (level >= 4) return 'Guardián de la Inteligencia';
        return 'Explorador de IA';
      },
      
      getCreationsByType: (type) => {
        const state = get();
        return state.moduleProgress
          .flatMap(module => module.creations)
          .filter(creation => creation.type === type);
      },
      
      getEthicalDecisionStats: () => {
        const state = get();
        const decisions = state.moduleProgress.flatMap(module => module.decisions);
        const positive = decisions.filter(d => d.impact === 'positive').length;
        const negative = decisions.filter(d => d.impact === 'negative').length;
        const neutral = decisions.filter(d => d.impact === 'neutral').length;
        const averageSocialScore = decisions.reduce((sum, d) => sum + d.socialScore, 0) / decisions.length || 0;
        
        return { positive, negative, neutral, averageSocialScore, total: decisions.length };
      },
      
      getSocialImpactScore: () => {
        const state = get();
        const decisions = state.moduleProgress.flatMap(module => module.decisions);
        const creations = state.moduleProgress.flatMap(module => module.creations);
        
        const ethicsScore = decisions.reduce((sum, d) => sum + d.socialScore, 0);
        const creativityScore = creations.filter(c => c.isPublic).length * 10;
        const collaborationScore = state.connectedPeers.length * 25;
        
        return ethicsScore + creativityScore + collaborationScore;
      }
    })),
    {
      name: 'nucleo-colectivo-ia-v3-game-state',
      version: 3,
    }
  )
);
